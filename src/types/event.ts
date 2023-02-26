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

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const eventCreationSchema = z
  .object({
    starts_at: z.date(),
    ends_at: z.date(),
    event_title: z.string().min(5, {
      message: "Event name must be at least 5 characters long",
    }),
    event_type: z.nativeEnum(eventType),
    event_description: z.string().min(5, {
      message: "Event description must be at least 10 characters long",
    }),
    partner_id: z.preprocess(
      (e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (e.value) {
          const selectedOption = e as unknown as {
            value: string;
            label: string;
          };
          return selectedOption.value;
        }
        return e;
      },
      z.string().uuid({
        message: "Invalid Partner Id Chosen",
      })
    ),
    online: z.preprocess((val) => val === "Yes", z.boolean()),
    location: z.string(),
    banner_image: z.union([
      z
        .any()
        .refine((file) => {
          return file?.size <= MAX_FILE_SIZE;
        }, `Max image size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
      // Allows for anullvalue
      z.any().nullable(),
    ]),

    rsvp_link: z
      .union([
        z.string().url({
          message:
            "Please input a valid url for users to RSVP at which begins with https",
        }),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine((schema) => schema.starts_at < schema.ends_at, {
    message: "Event start time must be before event end time",
    path: ["starts_at"],
  });

export type eventCreationInputType = z.infer<typeof eventCreationSchema>;
