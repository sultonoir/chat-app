import { TRPCError, initTRPC } from "@trpc/server";
import { Session, getServerSession } from "next-auth";
import { db } from "@/lib";
import superjson from "superjson";
import { ZodError } from "zod";

type CreateContextOptions = {
  session: Session | null;
};
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async () => {
  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerSession();

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      user,
      db,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
