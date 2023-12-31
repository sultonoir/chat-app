import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod";

export const ApiGroup = createTRPCRouter({
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string().optional(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: ctx.session.user.email as string,
        },
      });

      if (!user) {
        return null;
      }
      const group = await ctx.db.group.create({
        data: {
          userId: user.id,
          name: input.name,
          image: input.image,
          desc: input.desc,
          isAdmin: true,
          member: {
            create: {
              userId: user.id,
            },
          },
        },
      });
      return group;
    }),
  getGroup: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const group = ctx.db.group.findUnique({
        where: {
          id,
        },
        include: {
          message: {
            include: {
              user: true,
            },
          },
          member: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!group) {
        throw new TRPCError({ code: "NOT_FOUND", message: "group not found" });
      } else {
        return group;
      }
    }),
  createMessage: publicProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
        chatId: z.string().optional(),
        content: z.string().optional(),
        fileUrl: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, content, fileUrl, userId, chatId } = input;
      await ctx.db.message.create({
        data: {
          groupId,
          chatId,
          userId,
          fileUrl,
          content,
        },
      });
      await ctx.db.member.updateMany({
        where: {
          userId,
          groupId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    }),
  findMember: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { memberId } = input;
      const member = await ctx.db.user.findUnique({
        where: {
          id: memberId,
        },
      });
      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND", message: "user not found" });
      }

      return member;
    }),
  joinGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, userId } = input;

      const member = await ctx.db.member.findFirst({
        where: {
          groupId,
          userId,
        },
      });
      if (!member) {
        const member = await ctx.db.member.create({
          data: {
            groupId,
            userId,
          },
        });
        return member.groupId;
      }
      return member?.groupId;
    }),
  findChat: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        query: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, query } = input;
      const chat = await ctx.db.message.findMany({
        where: {
          OR: [
            {
              groupId,
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          user: true,
        },
      });
      return chat;
    }),
  addMember: publicProcedure
    .input(
      z.array(
        z.object({
          groupId: z.string(),
          memberId: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const existingMembers = await ctx.db.member.findMany({
        where: {
          OR: input.map((e) => ({
            groupId: e.groupId,
            userId: e.memberId,
          })),
        },
      });

      // Buat data anggota baru hanya untuk anggota yang belum ada dalam database
      const newMembers = input.filter((e) => {
        const isMemberExist = existingMembers.some((existingMember) => {
          return (
            existingMember.groupId === e.groupId &&
            existingMember.userId === e.memberId
          );
        });
        return !isMemberExist;
      });

      // Tambahkan anggota yang belum ada dalam database
      if (newMembers.length > 0) {
        await ctx.db.member.createMany({
          data: newMembers.map((e) => ({
            groupId: e.groupId,
            userId: e.memberId,
          })),
        });
      }
    }),
  updateGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        image: z.string().optional(),
        name: z.string().optional(),
        desc: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, image, name, desc } = input;
      const dataToUpdate: any = {};

      if (image !== "") {
        dataToUpdate.image = image;
      }

      if (name !== "") {
        dataToUpdate.name = name;
      }

      if (desc !== "") {
        dataToUpdate.desc = desc;
      }

      if (Object.keys(dataToUpdate).length > 0) {
        const group = await ctx.db.group.update({
          where: {
            id: groupId,
          },
          data: dataToUpdate,
        });
        return group;
      }
    }),
});
