import { createNewAdministratorSchema } from "./../../../types/partner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createOrganizationSchema } from "../../../types/partner";
import { adminServerSupabaseInstance } from "../../supabase/sharedInstance";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";

export const partnerRouter = createTRPCRouter({
  addNewAdministrator: supabaseProtectedProcedure
    .input(
      createNewAdministratorSchema.extend({
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user_email, partner_id } = input;

      const { userId: user_id, NextResponse } = ctx;

      // Validate that user is an administrator
      const { data: userAdmin, error: userAdminValidationError } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .select("*")
          .eq("partner_id", partner_id)
          .eq("user_id", user_id)
          .eq("approved", true)
          .maybeSingle();

      if (!userAdmin || userAdminValidationError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User must be an administrator in order to modify the organization",
        });
      }

      // We get the user's ID
      const { data: newAdminData, error: newAdminDataError } =
        await adminServerSupabaseInstance
          .from("User")
          .select("user_id")
          .eq("email", user_email)
          .maybeSingle();

      // This can happen if we cannot find the user or user does not exist - do not return an error either way.
      if (!newAdminData || newAdminDataError || !newAdminData.user_id) {
        return true;
      }

      // We now add the user
      await adminServerSupabaseInstance.from("UserPartnerOwnership").insert({
        approved: true,
        partner_id,
        user_id: newAdminData.user_id,
      });

      void NextResponse.revalidate(`/partner/${partner_id}`);

      return true;
    }),
  verifyValidOrganization: supabaseProtectedProcedure
    .input(
      z.object({
        partner_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { partner_id } = input;
      // Validate that organization has at least one administrator
      const { error, count } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .select("*", { count: "exact" })
        .eq("partner_id", partner_id);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to update Organization on backend. Please verify that data is correct",
        });
      }

      if (count == 0) {
        const { error: deleteOrganizationError } =
          await adminServerSupabaseInstance
            .from("Partner")
            .delete()
            .eq("partner_id", partner_id);

        if (deleteOrganizationError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Unable to update Organization on backend. Please verify that data is correct",
          });
        }
        return true;
      }

      return false;
    }),
  deletePartnerAdministrator: supabaseProtectedProcedure
    .input(
      z.object({
        user_id_deleting: z.string(),
        partner_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId: user_id, NextResponse } = ctx;
      const { user_id_deleting, partner_id } = input;

      // Verify that user has admin rights
      const { data, error } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .select("*")
        .eq("partner_id", user_id)
        .eq("user_id", user_id)
        .eq("approved", true);

      if (!data || error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to verify that user has admin rights",
        });
      }

      // Delete the existing user
      const { data: deletedUser, error: deletedUserError } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .delete()
          .eq("user_id", user_id_deleting)
          .eq("partner_id", partner_id)
          .select("*");

      if (!deletedUser || deletedUserError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete user. Please try again",
        });
      }

      void NextResponse.revalidate(`/partner/${partner_id}`);

      return;
    }),
  updatePartnerDetails: supabaseProtectedProcedure
    .input(
      createOrganizationSchema.extend({
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { NextResponse } = ctx;
      const {
        partner_id,
        partner_name,
        website,
        telegram_handle,
        twitter_id,
        bio,
      } = input;
      const { data, error } = await adminServerSupabaseInstance
        .from("Partner")
        .update({
          partner_name,
          website,
          telegram_handle,
          twitter_id,
          bio,
        })
        .eq("partner_id", partner_id)
        .select("*");

      if (error || !data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new organization - please try again and contact support if this problem persists",
        });
      }

      void NextResponse.revalidate(`/partner/${partner_id}`);

      return data;
    }),
  createPartner: supabaseProtectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const { partner_name, website, telegram_handle, twitter_id } = input;
      const { userId: user_id, NextResponse } = ctx;

      // First We try to create the partner org. if it already exists, then we throw an error. We use the name of the organisation as a unique key ( So people cannot create two partner orgs with the same name)
      const { data, error } = await adminServerSupabaseInstance
        .from("Partner")
        .insert({
          partner_name,
          website,
          telegram_handle,
          twitter_id,
          open_to_sponsor: false,
          stripe_account_id: null,
          active: true,
          approved: false,
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
            partner_id: data.partner_id,
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

      void NextResponse.revalidate(`/partner/${data.partner_id}`);

      return newPartnerOwnership;
    }),
  getPartnerInformation: supabaseProtectedProcedure
    .input(
      z.object({
        partner_id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { partner_id } = input;

      const { data, error } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .select("*, Partner(*),User(*)")
        .eq("partner_id", partner_id);

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

    // Check if user is an admin
    const { data, error } = await adminServerSupabaseInstance
      .from("User")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to obtain organization error",
      });
    }

    if (!data.admin) {
      const { data: UserPartners, error: UserPartnersError } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .select("*, Partner(*)")
          .eq("user_id", userId);

      if (UserPartnersError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: UserPartnersError.message,
        });
      }

      return UserPartners;
    }

    const { data: allPartners, error: allPartnersError } =
      await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .select("*, Partner(*)");

    if (allPartnersError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: allPartnersError.message,
      });
    }

    return allPartners;
  }),
  deletePartner: supabaseProtectedProcedure
    .input(
      z.object({
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, NextResponse } = ctx;
      const { partner_id } = input;

      const { data, error } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .delete()
        .eq("user_id", userId)
        .eq("partner_id", partner_id)
        .select("*");

      if (error || data?.length == 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to delete item",
        });
      }

      // We also verify that if this user is the only one left in the organization, we will just delete the organization
      const { error: UserPartnershipCountError, count } =
        await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .select("*", { count: "exact" })
          .eq("partner_id", partner_id);

      if (UserPartnershipCountError) {
        // We've already deleted the org, throw no errors
        return data;
      }

      if ((count as number) > 0) {
        return data;
      }
      // We delete organization either way
      const { error: PartnerDeletionError } = await adminServerSupabaseInstance
        .from("Partner")
        .delete()
        .eq("partner_id", partner_id);

      if (PartnerDeletionError) {
        return data;
      }

      void NextResponse.revalidate(`/partner/${partner_id}`);

      return data;
    }),
});
