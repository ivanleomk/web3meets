import { serverSupabaseInstance } from "./../../supabase/sharedInstance";
import { TRPCError } from "@trpc/server";
import { publicProcedure, supabaseProtectedProcedure } from "./../trpc";

import { createTRPCRouter } from "../trpc";
import { adminServerSupabaseInstance } from "../../supabase/sharedInstance";
import { type User } from "../../../types/database";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  updateUserName: supabaseProtectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { name } = input;

      const { data, error } = await adminServerSupabaseInstance
        .from("User")
        .update({
          user_name: name,
        })
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();

      console.log(data, error);

      if (!data || error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to update display name. Please contact support if this issue persists.",
        });
      }
    }),
  user: supabaseProtectedProcedure.query(async ({ ctx }) => {
    const { userId, userEmail } = ctx;

    const { data, error } = await adminServerSupabaseInstance
      .from("User")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    if (!data) {
      const { data: newUserData, error: newUserError } =
        await adminServerSupabaseInstance
          .from("User")
          .insert({
            user_id: userId,
            email: userEmail,
            admin: false,
          })
          .select("*")
          .single();

      if (newUserError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: newUserError.message,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return newUserData;
    }
    return data;
  }),
  isExistingUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { data } = await adminServerSupabaseInstance
        .from("User")
        .select("*")
        .eq("email", input.userEmail)
        .maybeSingle();

      if (!data) {
        return false;
      }
      return true;
    }),
});
