import { z } from "zod";

export enum eventType {
  free = "Free",
  paid = "Paid",
  mix = "Free Tickets with Paid option",
}

export enum eventLocation {
  online = "Online",
  offline = "Offline",
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
  event_type: z.nativeEnum(eventType),
  event_description: z.string().nullish(),

  // We can submit empty events here -> But only users with admin rights can do this. We verify this before submitting
  partner_id: z.union([
    z.string().uuid(),
    // Allow it to be nullable
    z.any().nullable(),
  ]),
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
});

export const eventCreationSchemaMerge = eventObjectSchema.merge(
  eventMediaFilesSchema
);

export const eventCreationSchema = eventCreationSchemaMerge.refine(
  (schema) => {
    return schema.starts_at < schema.ends_at;
  },
  {
    message: "Event start time must be before event end time",
    path: ["starts_at"],
  }
);

export type eventCreationInputType = z.infer<typeof eventCreationSchema>;
