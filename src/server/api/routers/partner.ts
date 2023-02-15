import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type UserPartnerOwnership } from "../../../types/database";
import { adminServerSupabaseInstance } from "../../supabase/sharedInstance";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";

export const partnerRouter = createTRPCRouter({
  createPartner: supabaseProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        website: z.string(),
        telegram_handle: z.string(),
        twitter_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, website, telegram_handle, twitter_id } = input;
      const { userId } = ctx;

      // First We try to create the partner org. if it already exists, then we throw an error. We use the name of the organisation as a unique key ( So people cannot create two partner orgs with the same name)
      const { data, error } = await adminServerSupabaseInstance
        .from("Partner")
        .insert({
          name,
          website,
          telegram_handle,
          twitter_id,
          open_to_sponsor: false,
          stripe_account_id: null,
          active: false,
        })
        .select("*")
        .maybeSingle();

      if (error || !data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new organization - please try again and contact support if this problem persists",
        });
      }

      // We then find the use the partner id and then insert it into the UserPartnerOwnership - setting it to false by default
      const { data: newPartnerOwnership, error: newPartnerOwnershipError } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .insert({
            user_id: userId,
            partner_id: data?.partner_id,
            approved: false,
          })
          .select("*")
          .maybeSingle();

      if (newPartnerOwnershipError || !newPartnerOwnership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new organization - please try again and contact support if this problem persists",
        });
      }

      return newPartnerOwnership;
    }),
  getAllPartners: supabaseProtectedProcedure.query(async ({ ctx }) => {
    const { userId, supabase } = ctx;

    const { data, error } = await supabase
      .from("UserPartnerOwnership")
      .select("*, Partner(*)")
      .eq("user_id", userId);

    console.log(data);

    return data;
  }),
});
