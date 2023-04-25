import { adminServerSupabaseInstance } from "src/server/supabase/sharedInstance";
import {
  createTRPCRouter,
  publicProcedure,
  supabaseAdminProtectedProcedure,
} from "../trpc";
import { sub } from "date-fns";
import { TRPCError } from "@trpc/server";
import { convertDateToTimestamptz } from "src/utils/date";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  deleteScheduledPost: supabaseAdminProtectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      const { data, error } = await adminServerSupabaseInstance
        .from("scheduledMessages")
        .delete()
        .eq("id", id);

      if (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error?.message ??
            "Unable to set event status. Please try again later",
        });
      }

      return data;
    }),
  getAllPosts: supabaseAdminProtectedProcedure.query(async () => {
    const { data, error } = await adminServerSupabaseInstance
      .from("scheduledMessages")
      .select("*,Event(*)")
      .gt(
        "scheduled_date",
        convertDateToTimestamptz(sub(new Date(), { days: 4 }))
      )
      .order("scheduled_date", { ascending: true });

    if (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message ?? "Unable to get post. Please try again later",
      });
    }

    console.log(data);

    return data;
  }),
  modifyPostDate: supabaseAdminProtectedProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input: { id, date } }) => {
      const { data, error } = await adminServerSupabaseInstance
        .from("scheduledMessages")
        .update({
          scheduled_date: convertDateToTimestamptz(date),
        })
        .eq("id", id);

      if (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error?.message ??
            "Unable to set event status. Please try again later",
        });
      }

      return data;
    }),
});
