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
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          email: ctx.session.user.email as string,
        },
        data: {
          image: input.image,
        },
      });
    }),
});
