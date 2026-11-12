import { z } from "zod";

export const addressSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(1, "City is required").min(2, "Enter a valid city"),
  state: z.string().trim(),
  zip: z
    .string()
    .trim()
    .refine((value) => !value || /^[A-Za-z0-9\s-]{4,10}$/.test(value), {
      message: "Enter a valid postal code",
    }),
  country: z.string().trim(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const emptyAddress: AddressFormData = {
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
};
