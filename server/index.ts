import { ApiUser } from "./apiUser";
import { ApiGroup } from "./apiGroup";
import { router } from "./trpc";

export const appRouter = router({
  user: ApiUser,
  group: ApiGroup,
});

export type AppRouter = typeof appRouter;
