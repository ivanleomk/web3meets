/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * tl;dr - This is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the
 * database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

/**
 * Replace this with an object if you want to pass things to
 * `createContextInner`.
 */
type CreateContextOptions = {
  supabase: SupabaseClient;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return _opts;
};

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const supabase = createServerSupabaseClient({
    req: _opts.req,
    res: _opts.res,
  });

  return createInnerTRPCContext({ supabase });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import {
  createServerSupabaseClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure;

export const isSupabaseAuthed = t.middleware(async (res) => {
  const { next, ctx } = res;
  const { supabase } = ctx;
  const { data: session } = await supabase.auth.getSession();

  if (!session) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Unauthorized Request",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;
  const userEmail = user?.email as string;
  const new_ctx = { ...ctx, userId, userEmail, supabase };

  return next({
    ctx: new_ctx,
  });
});

export const supabaseProtectedProcedure = t.procedure.use(isSupabaseAuthed);
