import { z } from "zod";

export const createOrganizationSchema = z.object({
  partner_name: z.string().min(5, "Name must be at least 5 characters long"),
  website: z
    .string()
    .url("Valid website address must be provided that start with http://"),
  telegram_handle: z.string().nullish(),
  twitter_id: z.string().nullish(),
  bio: z
    .union([z.string().length(0), z.string().min(4)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
