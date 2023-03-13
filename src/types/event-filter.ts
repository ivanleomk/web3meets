import { z } from "zod";

export enum eventTypeFilter {
  free = "Free",
  paid = "Paid",
  any = "Any",
  mix = "Mix",
}

export enum eventLocationFilter {
  any = "Any",
  online = "Online",
  offline = "Offline",
  hybrid = "Hybrid",
}

export const eventFilterSchema = z.object({
  starts_at: z.date().nullish(),
  ends_at: z.date().nullish(),
  event_type: z.nativeEnum(eventTypeFilter),
  event_location: z.nativeEnum(eventLocationFilter),
  start_to_end: z.array(z.number()).length(2),
});

export const refinedEventFilterSchema = eventFilterSchema.refine(
  (schema) => {
    if (!schema.starts_at || !schema.ends_at) {
      return true;
    }
    return schema.starts_at < schema.ends_at;
  },
  {
    message: "Event start time must be before event end time",
    path: ["starts_at"],
  }
);

export type refinedEventFilterType = z.infer<typeof refinedEventFilterSchema>;
