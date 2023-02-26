import { TRPCError } from "@trpc/server";
import { adminServerSupabaseInstance } from "./../../supabase/sharedInstance";
import { z } from "zod";
import { eventCreationSchema } from "../../../types/event";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";
import { convertDateToTimestamptz } from "../../../utils/date";

export const eventRouter = createTRPCRouter({
  createNewEvent: supabaseProtectedProcedure
    .input(eventCreationSchema)
    .mutation(async ({ input }) => {
      console.log(input);
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
            event_description,
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
