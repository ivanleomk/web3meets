import { z } from "zod";

export const createOrganizationSchema = z.object({
  partner_name: z.string().min(5, "Name must be at least 5 characters long"),
  website: z
    .string()
    .url(
      "Valid website address must be provided that start with http://websitename.com"
    ),
  telegram_handle: z.string().nullish(),
  twitter_id: z.string().nullish(),
  bio: z.string().nullish(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
