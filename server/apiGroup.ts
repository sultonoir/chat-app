import { privateProcedure, router } from "./trpc";
import { z } from "zod";

export const ApiGroup = router({
  createGroup: privateProcedure
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
          email: ctx.user.image as string,
        },
      });
      ctx.db.group.create({
        data: {
          userId: user?.id as string,
          name: input.name,
          image: input.image,
          desc: input.desc,
        },
      });
    }),
});
