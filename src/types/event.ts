import { z } from "zod";

export enum eventPaymentType {
  free = "Free",
  paid = "Paid",
  mix = "Free Tickets with Paid option",
}

export enum eventLocation {
  online = "Online",
  offline = "Offline",
  hybrid = "hybrid",
}

export enum City {
  Singapore = "Singapore",
  NA = "Not Applicable",
}

export enum Country {
  Singapore = "Singapore",
  NA = "Not Applicable",
}

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const eventMediaFilesSchema = z.object({
  images: z.union([
    z
      .any()
      .refine((files: File[]) => {
        if (!files) {
          return false;
        }
        return files.every((item) => item.size <= MAX_FILE_SIZE);
      }, `Max image size for each file is 5MB.`)
      .refine((files) => {
        if (!files) {
          return false;
        }
        return files.every((file: File) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        );
      }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
    // Allows for a null value
    z.any().nullable(),
  ]),
});

export const eventObjectSchema = z.object({
  starts_at: z.date(),
  ends_at: z.date(),
  event_title: z.string().min(5, {
    message: "Event name must be at least 5 characters long",
  }),
  event_type: z.nativeEnum(eventPaymentType),
  event_description: z.string().nullish(),

  // We allow for invalid partners
  partner_id: z.object({
    value: z.string().uuid(),
    label: z.string(),
  }),
  fallback_name: z.union([z.string(), z.string().nullable()]),
  online: z.nativeEnum(eventLocation),
  city: z.object({
    label: z.nativeEnum(City),
    value: z.nativeEnum(City),
  }),
  country: z.object({
    label: z.nativeEnum(Country),
    value: z.nativeEnum(Country),
  }),
  rsvp_link: z.union([
    z.string().url({
      message:
        "Please input a valid url for users to RSVP at which begins with https",
    }),
    z.string().nullish(),
  ]),
  location: z.string().nullish(),
  category: z.object({
    value: z.string(),
    label: z.string(),
  }),
});

export const eventCategories = [
  "Hackathon",
  "Meetup",
  "Seminar",
  "Exhibition",
  "Conference",
  "Workshop",
  "Twitter Spaces",
  "Networking",
  "Panel",
  "Demo Day",
  "Party",
  "Focus Group Discussion",
  "Education Event",
  "Social Event",
];

export const eventCreationSchemaMerge = eventObjectSchema.merge(
  eventMediaFilesSchema
);

export const eventCreationSchema = eventCreationSchemaMerge
  .refine(
    (schema) => {
      return schema.starts_at < schema.ends_at;
    },
    {
      message: "Event start time must be before event end time",
      path: ["starts_at"],
    }
  )
  .refine(
    (schema) => {
      if (
        (schema.city.value == City.NA && schema.country.value == Country.NA) ||
        (schema.city.value == City.Singapore &&
          schema.country.value == Country.Singapore)
      ) {
        return true;
      }
      return false;
    },
    {
      message: "Invalid pairs for country and city",
      path: ["city"],
    }
  )
  .transform((schema) => {
    return {
      ...schema,
      fallback_name:
        schema.partner_id.value === process.env.NEXT_PUBLIC_NONE_PARTNER
          ? schema.fallback_name
          : null,
    };
  });

export type eventCreationInputType = z.infer<typeof eventCreationSchema>;
