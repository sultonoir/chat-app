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
      const member = [];
      member.push(user.id);
      const group = await ctx.db.group.create({
        data: {
          userId: user.id,
          name: input.name,
          image: input.image,
          desc: input.desc,
          isAdmin: true,
          member,
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
});
