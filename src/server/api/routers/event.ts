import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  supabaseProtectedProcedure,
} from "../trpc";

export const eventRouter = createTRPCRouter({});
