import * as z from "zod";

export const SHOOT_TYPES = [
  "Portrait",
  "Editorial or brand",
  "Event or live performance",
  "Something else",
] as const;

export const MESSAGE_LIMIT = 1000;

/** Shared by the contact form and the send API, so both agree on what's valid. */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  shootType: z.enum(SHOOT_TYPES, {
    errorMap: () => ({ message: "Please choose a shoot type" }),
  }),
  preferredDate: z
    .string()
    .max(100)
    .optional()
    .transform((val) => val || undefined),
  message: z
    .string()
    .min(10, "Please tell me a little more — at least 10 characters")
    .max(MESSAGE_LIMIT, `Message must be less than ${MESSAGE_LIMIT} characters`),
  instagram: z
    .string()
    .max(50)
    .optional()
    .transform((val) => val || undefined),
});

export type ContactFormData = z.infer<typeof contactSchema>;
