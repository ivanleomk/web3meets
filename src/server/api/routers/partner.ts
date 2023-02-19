import { UserPartnerOwnershipWithPartner } from "./../../../types/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createOrganizationSchema } from "../../../types/partner";
import { adminServerSupabaseInstance } from "../../supabase/sharedInstance";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";

export const partnerRouter = createTRPCRouter({
  updatePartnerDetails: supabaseProtectedProcedure
    .input(
      z.object({
        partner_name: z.string(),
        website: z.string().url(),
        telegram_handle: z.string().nullish(),
        twitter_id: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Figure out a way to deal with naming updates --> We should use an internal id to track all of the various partners....

      const { partner_name, website, telegram_handle, twitter_id } = input;
      const { error } = await adminServerSupabaseInstance
        .from("Partner")
        .update({
          partner_name,
          website,
          telegram_handle,
          twitter_id,
        })
        .eq("partner_name", partner_name);

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new organization - please try again and contact support if this problem persists",
        });
      }
    }),
  createPartner: supabaseProtectedProcedure
    .input(
      createOrganizationSchema.extend({
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { partner_id, partner_name, website, telegram_handle, twitter_id } =
        input;
      const { userId: user_id } = ctx;

      // First We try to create the partner org. if it already exists, then we throw an error. We use the name of the organisation as a unique key ( So people cannot create two partner orgs with the same name)
      const { data, error } = await adminServerSupabaseInstance
        .from("Partner")
        .insert({
          partner_id,
          partner_name,
          website,
          telegram_handle,
          twitter_id,
          open_to_sponsor: false,
          stripe_account_id: null,
          active: false,
        })
        .select("*")
        .maybeSingle();

      if (
        error?.message ===
        'duplicate key value violates unique constraint "Partner_partner_name_key"'
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Organization name has already been taken on our platform. Please try another name.",
        });
      }
      if (error || !data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error?.message,
        });
      }

      // We then find the use the partner id and then insert it into the UserPartnerOwnership - setting it to false by default
      const { data: newPartnerOwnership, error: newPartnerOwnershipError } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .insert({
            user_id,
            partner_id,
            approved: false,
          })
          .select("*")
          .maybeSingle();

      if (newPartnerOwnershipError || !newPartnerOwnership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: newPartnerOwnershipError?.message,
        });
      }

      return newPartnerOwnership;
    }),
  getPartnerInformation: supabaseProtectedProcedure
    .input(
      z.object({
        partner_name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId: user_id } = ctx;
      const { partner_name } = input;

      const { data, error } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .select("*,Partner(*)")
        .eq("partner_name", partner_name)
        .eq("user_id", user_id)
        .maybeSingle();

      if (!data || error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to get information on Organization. Please try again later",
        });
      }

      return data;
    }),
  getAllPartners: supabaseProtectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const { data, error } = await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*, Partner(*)")
      .eq("user_id", userId);

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    return data;
  }),
  deletePartner: supabaseProtectedProcedure
    .input(
      z.object({
        partner_name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { partner_name } = input;

      const { data, error } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .delete()
        .eq("user_id", userId)
        .eq("partner_name", partner_name)
        .select("*");

      if (error || data?.length == 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to delete item",
        });
      }

      return data;
    }),
});
