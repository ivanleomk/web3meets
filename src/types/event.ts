import { z } from "zod";

export enum recurrence {
  SingleEvent = "Single Event",
  Monthly = "Monthly",
  Weekly = "Weekly",
  Biweekly = "Biweekly",
}

export const eventCreationSchema = z.object({
  starts_at: z.date(),
  ends_at: z.date(),
  event_title: z.string().min(5, {
    message: "Event name must be at least 5 characters long",
  }),
  paid_event: z.preprocess((a) => {
    return a === "Yes";
  }, z.boolean()),
  remarks: z.string().nullish(),
  recurring_event: z.preprocess((a) => {
    return a === "Yes";
  }, z.nativeEnum(recurrence)),
});

export type eventCreationInputType = z.infer<typeof eventCreationSchema>;
