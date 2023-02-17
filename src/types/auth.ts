import { z } from "zod";

export const userAuthEmailAndPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email must be provided",
    })
    .email(),
  password: z
    .string({
      required_error: "Password must be provided",
    })
    .min(6, "Please enter a password with at least 6 characters"),
});

export type userAuthEmailAndPasswordType = z.infer<
  typeof userAuthEmailAndPasswordSchema
>;
