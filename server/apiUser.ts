import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const ApiUser = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        email: ctx.session.user.email as string,
      },
      include: {
        message: true,
        group: true,
      },
    });
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return user;
  }),
  postUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name, username } = input;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userEmail = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });
      if (userEmail) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "email has used" });
      }
      const userName = await ctx.db.user.findUnique({
        where: {
          username,
        },
      });
      if (userName) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "username has used",
        });
      }

      const user = await ctx.db.user.create({
        data: {
          email,
          hashedPassword,
          username,
          name,
        },
      });
      const group = await ctx.db.group.findUnique({
        where: {
          id: "65236299e43bef29922b94a8",
        },
      });
      if (!group) {
        throw new TRPCError({ code: "NOT_FOUND", message: "group not found" });
      }
      const member = [...(group.member || [])];
      member.push(user.id);
      await ctx.db.group.update({
        where: {
          id: "65236299e43bef29922b94a8",
        },
        data: {
          member,
        },
      });
    }),
  updatePhotoProfile: protectedProcedure
    .input(
      z.object({
        image: z.string().optional(),
        status: z.string().optional(),
        name: z.string().optional(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image, username, status } = input;
      await ctx.db.user.update({
        where: {
          email: ctx.session.user.email as string,
        },
        data: {
          image,
          name,
          status,
          username,
        },
      });
    }),
  createChat: publicProcedure
    .input(
      z.object({
        cureenUserId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, cureenUserId } = input;
      const chat = await ctx.db.chat.findFirst({
        where: {
          OR: [
            {
              receiverId: userId,
              senderId: cureenUserId,
            },
            {
              receiverId: cureenUserId,
              senderId: userId,
            },
          ],
        },
      });
      if (chat) {
        return chat.id;
      } else {
        const chat = await ctx.db.chat.create({
          data: {
            receiverId: userId,
            senderId: cureenUserId,
          },
        });
        return chat.id;
      }
    }),
  getChat: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          sender: true,
          receiver: true,
          message: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "chat not found" });
      } else {
        return chat;
      }
    }),
  createMessage: publicProcedure
    .input(
      z.object({
        chatId: z.string().optional(),
        content: z.string().optional(),
        fileUrl: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { content, fileUrl, userId, chatId } = input;
      await ctx.db.message.create({
        data: {
          chatId,
          userId,
          fileUrl,
          content,
        },
      });
    }),
});
