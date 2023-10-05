import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const ApiUser = router({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        email: ctx.user.email as string,
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

      await ctx.db.user.create({
        data: {
          email,
          hashedPassword,
          username,
          name,
        },
      });
    }),
  updatePhotoProfile: privateProcedure
    .input(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          email: ctx.user.email as string,
        },
        data: {
          image: input.image,
        },
      });
    }),
});
