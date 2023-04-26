import { TRPCError } from "@trpc/server";
import {
  adminServerSupabaseInstance,
  serverSupabaseInstance,
} from "./../../supabase/sharedInstance";
import { supabaseAdminProtectedProcedure } from "./../trpc";
import { z } from "zod";

import { createTRPCRouter } from "../trpc";
import { convertDateToTimestamptz } from "../../../utils/date";
import { formatTelegramMessage } from "src/utils/string";
import { bot, sendTelegramMessage } from "src/utils/telebot";

export const adminRouter = createTRPCRouter({
  sendMessage: supabaseAdminProtectedProcedure
    .input(
      z.object({
        event_id: z.string(),
        event_title: z.string(),
        category: z.string(),
        starts_at: z.date(),
        ends_at: z.date(),
        rsvp_link: z.string(),
        location: z.string(),
        id: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        event_title,
        category,
        starts_at,
        ends_at,
        rsvp_link,
        location,
        event_id,
        id,
      } = input;

      const formattedMessage = formatTelegramMessage(
        event_title,
        category,
        starts_at,
        ends_at,
        rsvp_link,
        location
      );
      const res = await sendTelegramMessage(formattedMessage);

      const { message_id } = res;

      if (!id) {
        // Add to the db to track messages sent
        const { error } = await adminServerSupabaseInstance
          .from("scheduledMessages")
          .insert({
            event_id,
            message_datetime_sent: convertDateToTimestamptz(new Date()),
            message_text_sent: formattedMessage,
            wasScheduled: false,
            sent: true,
            message_id,
            scheduled_date: convertDateToTimestamptz(new Date()),
          });

        if (error) {
          console.log(error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              error?.message ??
              "Unable to set event status. Please try again later",
          });
        }

        return;
      }

      const { error: unableToSendMessage } = await adminServerSupabaseInstance
        .from("scheduledMessages")
        .update({
          message_datetime_sent: convertDateToTimestamptz(new Date()),
          message_text_sent: formattedMessage,
          sent: true,
          message_id,
        })
        .eq("id", id);

      if (unableToSendMessage) {
        console.log(unableToSendMessage);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            unableToSendMessage?.message ??
            "Unable to set event status. Please try again later",
        });
      }

      return;

      return;
    }),
  editMessage: supabaseAdminProtectedProcedure
    .input(
      z.object({
        message_id: z.number(),
        new_text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { message_id, new_text } = input;

      const res = await bot.editMessageText(new_text, { message_id });
      const { data, error } = await adminServerSupabaseInstance
        .from("scheduledMessages")
        .update({
          message_text_sent: new_text,
        })
        .eq("message_id", message_id);

      if (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error?.message ??
            "Unable to edit message text. Please try again later",
        });
      }

      return;
    }),
  updatePostDate: supabaseAdminProtectedProcedure
    .input(
      z.object({
        date: z.date(),
        event_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { date, event_id } = input;

      // TODO: fix up
      const { data, error } = await adminServerSupabaseInstance
        .from("scheduledMessages")
        .insert({
          scheduled_date: convertDateToTimestamptz(date),
          event_id,
          wasScheduled: true,
        });

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
  getEvents: supabaseAdminProtectedProcedure.query(async () => {
    // Get latest 1000 events
    const { data, error } = await adminServerSupabaseInstance
      .from("Event")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

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
          message:
            error?.message ??
            "Unable to set event status. Please try again later",
        });
      }
      try {
        await NextResponse.revalidate("/events");
      } catch (err) {
        console.log(
          `Error encountered when revalidating / while setting event status : ${err}`
        );
      }

      return data;
    }),
  getOrganisation: supabaseAdminProtectedProcedure.query(async () => {
    // Get latest 1000 partners
    const { data, error } = await adminServerSupabaseInstance
      .from("Partner")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error?.message ??
          "Unable to get organisations. Please try again later",
      });
    }

    return data;
  }),
  deleteOrganization: supabaseAdminProtectedProcedure
    .input(
      z.object({
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { partner_id } = input;
      const { error } = await adminServerSupabaseInstance
        .from("Partner")
        .delete()
        .eq("partner_id", partner_id);

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error?.message ??
            "Unable to delete partner organisation. Please try again later",
        });
      }

      const { error: deletingOwnership } = await adminServerSupabaseInstance
        .from("UserPartnerOwnership")
        .delete()
        .eq("partner_id", partner_id);

      if (deletingOwnership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            deletingOwnership.message ??
            "Unable to delete partner organisation. Please try again later",
        });
      }

      return;
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
          message:
            error?.message ??
            "Unable to update partner organisation status. Please try again later.",
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
            message:
              existingUserOwnershipsError?.message ??
              "Unable to update partner organisation status. Please try again later.",
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
              message:
                updateUserPartnerOwnershipError?.message ??
                "Unable to update partner organisation status. Please try again later.",
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
            message:
              massDisqualificationError.message ??
              "Unable to update partner organisation status. Please try again later.",
          });
        }
      }

      return data;
    }),
});
