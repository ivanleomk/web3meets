import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters long"),
  website: z.string().url("Valid website address must be provided"),
  telegram_handle: z.string().nullish(),
  twitter_id: z.string().nullish(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
