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
        member: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        friend: true,
      },
    });
    await ctx.db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        lastSeen: new Date(),
        online: true,
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
          status: "https://github.com/sultonoir",
        },
      });

      await ctx.db.group.update({
        where: {
          id: "6524e94a0c5f45b186422f58",
        },
        data: {
          member: {
            create: {
              userId: user.id,
            },
          },
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
        await ctx.db.member.createMany({
          data: [
            {
              userId: cureenUserId,
              chatId: chat.id, // Sertakan chatId yang sesuai
            },
            {
              userId,
              chatId: chat.id, // Sertakan chatId yang sesuai
            },
          ],
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
      await ctx.db.member.updateMany({
        where: {
          userId,
          chatId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    }),
  findChat: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        currentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { currentId, userId } = input;
      const chat = await ctx.db.chat.findFirst({
        where: {
          OR: [
            {
              senderId: currentId,
              receiverId: userId,
            },
            {
              senderId: userId,
              receiverId: currentId,
            },
          ],
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
      }
      return chat;
    }),
  findAll: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { query } = input;
      const currentUser = await ctx.db.user.findUnique({
        where: {
          email: ctx.session?.user?.email as string,
        },
      });
      const userSearch = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });
      const group = await ctx.db.group.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });
      const user = userSearch.filter((e) => e.id !== currentUser?.id);
      return { user, group };
    }),
  addfriend: publicProcedure
    .input(
      z.object({
        friendId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { friendId, userId } = input;
      await ctx.db.friend.create({
        data: {
          friendId,
          userId,
        },
      });
    }),
});
