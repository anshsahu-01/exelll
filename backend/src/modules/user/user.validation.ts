import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  mobileNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^(\+91)?[6-9]\d{9}$/.test(value),
      "Invalid mobile number format"
    ),

  collegeName: z
    .string()
    .trim()
    .max(100, "College name cannot exceed 100 characters")
    .optional(),

  location: z.string().trim().max(200, "Location cannot exceed 200 characters").optional(),
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
});

export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", {
    message: "Confirmation text must be 'DELETE'",
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
