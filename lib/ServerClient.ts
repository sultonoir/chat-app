import { appRouter } from "@/server";

import { db } from ".";

export const serverClient = appRouter.createCaller({
  session: null,
  db,
});
