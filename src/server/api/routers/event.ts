import { publicProcedure } from "./../trpc";
import { isEventAdmin } from "./../../utils/auth";
import { EVENT_IMAGE_BUCKET } from "./../../../types/storage";
import { City, eventLocation, eventObjectSchema } from "./../../../types/event";
import { TRPCError } from "@trpc/server";
import { adminServerSupabaseInstance } from "./../../supabase/sharedInstance";
import { z } from "zod";
import { eventCreationSchema } from "../../../types/event";

import { createTRPCRouter, supabaseProtectedProcedure } from "../trpc";
import { convertDateToTimestamptz } from "../../../utils/date";
import {
  hasAdminPrivileges,
  isOrganizationAdmin,
  isOrganizationEvent,
} from "../../utils/auth";
import { type Database } from "../../../types/database-raw";

export const eventRouter = createTRPCRouter({
  updateEvent: supabaseProtectedProcedure
    .input(
      eventObjectSchema.extend({
        event_id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that user is an admin
      const { userId: user_id, NextResponse } = ctx;
      const { event_id, ...eventInformation } = input;
      const partner_id = eventInformation.partner_id.value;

      const hasAdminRights = await hasAdminPrivileges(user_id);
      const hasEventAdminPermission = await isEventAdmin(user_id, event_id);

      // We determine if the user is registered as the event id registrar on the backend.

      if (!hasAdminRights && !hasEventAdminPermission) {
        // Non-Admin means we need to do more checksl
        await isOrganizationAdmin(partner_id, user_id);
        await isOrganizationEvent(partner_id, event_id);
      }

      const processedEventInformation: Database["public"]["Tables"]["Event"]["Update"] =
        {
          ...eventInformation,
          category: eventInformation.category.value,
          city: eventInformation.city.value,
          country: eventInformation.country.value,
          starts_at: convertDateToTimestamptz(eventInformation.starts_at),
          ends_at: convertDateToTimestamptz(eventInformation.ends_at),
          event_description: eventInformation.event_description
            ? eventInformation.event_description
            : undefined,
          online: eventInformation.online,
          partner_id: eventInformation.partner_id.value,
        };

      //Update event with new details
      const { data, error } = await adminServerSupabaseInstance
        .from("Event")
        .update(processedEventInformation)
        .eq("event_id", event_id)
        .select("*")
        .maybeSingle();

      if (error || !data) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update event. Please try again later",
        });
      }

      // void NextResponse.revalidate(`/event/${event_id}`);
      // void NextResponse.revalidate(`/partner/${partner_id}`);
      void NextResponse.revalidate(`/`);

      return data;
    }),
  getPartnerEvents: supabaseProtectedProcedure
    .input(
      z.object({
        partner_id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { partner_id } = input;
      const { userId: user_id } = ctx;

      // Step 1 : Validate that user is an admin
      await isOrganizationAdmin(partner_id, user_id);

      // Step 2 : Get organization events
      const { data, error } = await adminServerSupabaseInstance
        .from("Event")
        .select("*")
        .eq("partner_id", partner_id);

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to get organization events. Please try again later",
        });
      }

      return data;
    }),
  deleteAllImages: supabaseProtectedProcedure
    .input(
      z.object({
        event_id: z.string().uuid(),
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId: user_id } = ctx;
      const { partner_id, event_id } = input;

      const hasAdminRights = await hasAdminPrivileges(user_id);
      const hasEventAdminPermission = await isEventAdmin(user_id, event_id);

      // We determine if the user is registered as the event id registrar on the backend.

      if (!hasAdminRights && !hasEventAdminPermission) {
        // Non-Admin means we need to do more checksl
        await isOrganizationAdmin(partner_id, user_id);
        await isOrganizationEvent(partner_id, event_id);
      }

      // Remove all the individual images from db
      const { error: removingImagesError } = await adminServerSupabaseInstance
        .from("PromotionalMaterial")
        .delete()
        .eq("event_id", event_id)
        .select("*");

      if (removingImagesError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to update event information. Please try again later",
        });
      }

      // Now we physicall delete all images from backend
      const { data: files } = await adminServerSupabaseInstance.storage
        .from(EVENT_IMAGE_BUCKET)
        .list(event_id);

      const fileNames = files?.map((file) => {
        return `${event_id}/${file.name}`;
      });

      if (!fileNames) {
        return true;
      }

      const { data, error } = await adminServerSupabaseInstance.storage
        .from(EVENT_IMAGE_BUCKET)
        .remove(fileNames);

      return true;
    }),
  unauthorizedUploadImages: publicProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            image_url: z.string().url(),
            file_name: z.string(),
          })
        ),
        event_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { event_id, images } = input;
      const insertionData = images.map((item) => {
        return {
          event_id,
          image_url: item.image_url,
          original_name: item.file_name,
        };
      });

      const { data, error } = await adminServerSupabaseInstance
        .from("PromotionalMaterial")
        .insert(insertionData)
        .select("*");

      if (error) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message:
            "Unable to update database with all the promotional material",
        });
      }

      return data;
    }),
  uploadImages: supabaseProtectedProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            image_url: z.string().url(),
            file_name: z.string(),
          })
        ),
        event_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { event_id, images } = input;
      const { NextResponse } = ctx;
      const insertionData = images.map((item) => {
        return {
          event_id,
          image_url: item.image_url,
          original_name: item.file_name,
        };
      });

      const { data, error } = await adminServerSupabaseInstance
        .from("PromotionalMaterial")
        .insert(insertionData)
        .select("*");

      if (error) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message:
            "Unable to update database with all the promotional material",
        });
      }

      // void NextResponse.revalidate(`/event/${event_id}`);
      void NextResponse.revalidate(`/`);

      return data;
    }),
  deleteEvent: supabaseProtectedProcedure
    .input(
      z.object({
        event_id: z.string().uuid(),
        partner_id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId: user_id, NextResponse } = ctx;
      const { event_id, partner_id } = input;

      const hasAdminRights = await hasAdminPrivileges(user_id);
      const hasEventAdminPermission = await isEventAdmin(user_id, event_id);

      // We determine if the user is registered as the event id registrar on the backend.

      if (!hasAdminRights && !hasEventAdminPermission) {
        // Non-Admin means we need to do more checksl
        await isOrganizationAdmin(partner_id, user_id);
        await isOrganizationEvent(partner_id, event_id);
      }

      // Now we delete the event - associated images should be deleted accordingly.
      const { data, error } = await adminServerSupabaseInstance
        .from("Event")
        .delete()
        .eq("event_id", event_id)
        .eq("partner_id", partner_id)
        .select("*")
        .maybeSingle();

      if (error || !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to delete event from database. Please try again later or contact support if this issue persists.",
        });
      }

      // void NextResponse.revalidate(`/partner/${partner_id}`);
      void NextResponse.revalidate(`/`);

      return data;
    }),
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

    const partnerIds = data?.map((item) => item.partner_id);

    const { data: events, error: eventsError } =
      await adminServerSupabaseInstance
        .from("Event")
        .select()
        .in("partner_id", partnerIds as string[]);

    if (eventsError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get list of events",
      });
    }

    const { data: userUnapprovedEvents, error: userUnapprovedEventsError } =
      await adminServerSupabaseInstance
        .from("Event")
        .select("*")
        .eq("user_id", user_id);

    if (userUnapprovedEventsError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to get list of events",
      });
    }

    const userApprovedEvents = events ? events : [];
    const userUnapprovedEventsCoerced = userUnapprovedEvents
      ? userUnapprovedEvents
      : [];

    const res = userApprovedEvents.concat(userUnapprovedEventsCoerced);
    return res;
  }),
  unauthorizedCreateNewEvent: publicProcedure
    .input(eventObjectSchema)
    .mutation(async ({ input }) => {
      const {
        event_title,
        event_type,
        starts_at,
        ends_at,
        rsvp_link,
        partner_id,
        online,
        city,
        country,
        event_description,
        location,
        fallback_name,
        category,
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
            partner_id: partner_id.value,
            online: online,
            event_description: event_description
              ? event_description
              : undefined,
            city: city.value,
            country: country.value,
            location,
            category: category.value,
            fallback_name,
            user_id: null,
            approved: false,
          })
          .select("*")
          .maybeSingle();

      if (insertEventOpError || !insertEventOp) {
        console.log(insertEventOpError);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            insertEventOpError?.message ??
            "Unable to create new event. Please try again later or contact support if this error persists",
        });
      }

      return insertEventOp;
    }),
  createNewEvent: supabaseProtectedProcedure
    .input(eventObjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { NextResponse, userId: user_id } = ctx;
      const {
        event_title,
        event_type,
        starts_at,
        ends_at,
        rsvp_link,
        partner_id,
        online,
        city,
        country,
        event_description,
        location,
        fallback_name,
        category,
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
            partner_id: partner_id.value,
            online: online,
            event_description: event_description
              ? event_description
              : undefined,
            city: city.value,
            country: country.value,
            location,
            category: category.value,
            fallback_name,
            user_id:
              partner_id.value === process.env.NEXT_PUBLIC_NONE_PARTNER
                ? user_id
                : null,
            approved:
              partner_id.value === process.env.NEXT_PUBLIC_NONE_PARTNER
                ? false
                : true,
          })
          .select("*")
          .maybeSingle();

      if (insertEventOpError || !insertEventOp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to create new event. Please try again later or contact support if this error persists",
        });
      }

      if (partner_id.value !== process.env.NEXT_PUBLIC_NONE_PARTNER) {
        // void NextResponse.revalidate(`/event/${insertEventOp.event_id}`);
        // void NextResponse.revalidate(`/partner/${partner_id}`);
        void NextResponse.revalidate(`/`);
      }
      return insertEventOp;
    }),
});
