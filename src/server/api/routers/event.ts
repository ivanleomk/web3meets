import { TRPCError } from "@trpc/server";
import { adminServerSupabaseInstance } from "./../../supabase/sharedInstance";
import { z } from "zod";
import { eventCreationSchema } from "../../../types/event";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";
import { convertDateToTimestamptz } from "../../../utils/date";

export const eventRouter = createTRPCRouter({
  getUserEvents: supabaseProtectedProcedure.query(async ({ ctx }) => {
    const { userId: user_id } = ctx;

    const { data, error } = await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*,Partner(*)")
      .eq("user_id", user_id);

    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get list of events",
      });
    }

    const partnerIds = data.map((item) => item.partner_id);

    const { data: events, error: eventsError } =
      await adminServerSupabaseInstance
        .from("Event")
        .select()
        .in("partner_id", partnerIds);

    if (eventsError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get list of events",
      });
    }

    return events;
  }),
  createNewEvent: supabaseProtectedProcedure
    .input(eventCreationSchema)
    .mutation(async ({ input }) => {
      const {
        event_title,
        event_type,
        banner_image,
        starts_at,
        ends_at,
        rsvp_link,
        partner_id,
        online,
        location,
        event_description,
      } = input;

      const { data: insertEventOp, error: insertEventOpError } =
        await adminServerSupabaseInstance
          .from("Event")
          .insert({
            event_title,
            event_type,
            starts_at: convertDateToTimestamptz(starts_at),
            ends_at: convertDateToTimestamptz(ends_at),
            rsvp_link: rsvp_link,
            partner_id,
            online,
            event_description: event_description
              ? event_description
              : undefined,
          })
          .select("*")
          .maybeSingle();

      if (insertEventOpError || !insertEventOp) {
        console.log(insertEventOpError);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new event. Please try again later or contact support if this error persists",
        });
      }

      // We insert in the banner image if we can do so
      if (banner_image) {
        const { data: insertMediaOperation, error: insertMediaOperationError } =
          await adminServerSupabaseInstance
            .from("PromotionalMaterial")
            .insert({
              event_id: insertEventOp.event_id,
              image_url: banner_image,
            })
            .select("*")
            .maybeSingle();

        if (insertMediaOperationError || !insertMediaOperation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Unable to create new event. Please try again later or contact support if this error persists",
          });
        }
      }

      return insertEventOp;
    }),
});
