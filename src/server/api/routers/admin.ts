import { TRPCError } from "@trpc/server";
import { adminServerSupabaseInstance } from "./../../supabase/sharedInstance";
import { supabaseAdminProtectedProcedure } from "./../trpc";
import { z } from "zod";

import { createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  getEvents: supabaseAdminProtectedProcedure.query(async () => {
    // Get latest 1000 events
    const { data, error } = await adminServerSupabaseInstance
      .from("Event")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get all Events",
      });
    }

    return data;
  }),
  setEventStatus: supabaseAdminProtectedProcedure
    .input(
      z.object({
        event_id: z.string().uuid(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { event_id, status } = input;
      const { NextResponse } = ctx;

      // Update event status
      const { data, error } = await adminServerSupabaseInstance
        .from("Event")
        .update({
          approved: status,
        })
        .eq("event_id", event_id)
        .select("*")
        .maybeSingle();

      if (error || !data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to update event status",
        });
      }

      void NextResponse.revalidate("/");

      return data;
    }),
  getOrganisation: supabaseAdminProtectedProcedure.query(async () => {
    // Get latest 1000 events
    const { data, error } = await adminServerSupabaseInstance
      .from("Partner")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get all Organisation",
      });
    }

    return data;
  }),
  toggleOrganizationStatus: supabaseAdminProtectedProcedure
    .input(
      z.object({
        partner_id: z.string().uuid(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { partner_id, status } = input;
      // Update event status
      const { data, error } = await adminServerSupabaseInstance
        .from("Partner")
        .update({
          approved: status,
        })
        .eq("partner_id", partner_id)
        .select("*")
        .maybeSingle();

      if (error || !data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to update partner status",
        });
      }

      // If we are approving this organisation
      if (status) {
        // Verify that this was a newly approved organisation
        const {
          data: existingUserOwnerships,
          error: existingUserOwnershipsError,
        } = await adminServerSupabaseInstance
          .from("UserPartnerOwnership")
          .select("*")
          .eq("partner_id", partner_id);

        if (!existingUserOwnerships || existingUserOwnershipsError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Unable to update partner status",
          });
        }

        if (
          existingUserOwnerships?.length == 1 &&
          !existingUserOwnerships?.at(0)?.approved
        ) {
          const {
            error: updateUserPartnerOwnershipError,
            data: updateUserPartnerOwnership,
          } = await adminServerSupabaseInstance
            .from("UserPartnerOwnership")
            .update({
              approved: true,
            })
            .eq("partner_id", partner_id)
            .select("*")
            .maybeSingle();

          if (!updateUserPartnerOwnership || updateUserPartnerOwnershipError) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Unable to update partner status",
            });
          }
        }
      } else {
        // We set everyone to unapproved
        const { error: massDisqualificationError } =
          await adminServerSupabaseInstance
            .from("UserPartnerOwnership")
            .update({
              approved: false,
            })
            .eq("partner_id", partner_id);

        if (massDisqualificationError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to update permissions. Please try again later.",
          });
        }
      }

      return data;
    }),
});
