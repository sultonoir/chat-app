import { z } from "zod";

import { publicProcedure, privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
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
});

export type AppRouter = typeof appRouter;
