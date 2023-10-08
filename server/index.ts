import { ApiUser } from "./apiUser";
import { ApiGroup } from "./apiGroup";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: ApiUser,
  group: ApiGroup,
});

export type AppRouter = typeof appRouter;
