import { TRPCError } from "@trpc/server";
import { supabaseProtectedProcedure } from "./../trpc";

import { createTRPCRouter } from "../trpc";
import { adminServerSupabaseInstance } from "../../supabase/sharedInstance";
import { type User } from "../../../types/database";

export const userRouter = createTRPCRouter({
  user: supabaseProtectedProcedure.query(async ({ ctx }) => {
    const { userId, userEmail, supabase } = ctx;

    const { data, error } = await supabase
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
    return data as User;
  }),
});
