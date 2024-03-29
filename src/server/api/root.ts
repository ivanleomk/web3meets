import { createTRPCRouter } from "./trpc";

import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { partnerRouter } from "./routers/partner";
import { crawlerRouter } from "./routers/crawler";
import { adminRouter } from "./routers/admin";
import { postRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  partner: partnerRouter,
  event: eventRouter,
  user: userRouter,
  crawler: crawlerRouter,
  admin: adminRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
