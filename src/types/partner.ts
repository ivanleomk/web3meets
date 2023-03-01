import { z } from "zod";

export const createOrganizationSchema = z.object({
  partner_name: z.string().min(5, "Name must be at least 5 characters long"),
  website: z.string().nullish(),
  telegram_handle: z.string().nullish(),
  twitter_id: z.string().nullish(),
  bio: z
    .union([z.string().length(0), z.string().min(4)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export const createNewAdministratorSchema = z.object({
  user_email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateAdministratorInput = z.infer<
  typeof createNewAdministratorSchema
>;
