import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters long"),
  username: z.string().trim().min(3, "Username must be at least 3 characters long"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(6, "Valid contact number required"),
  website: z.string().trim().min(3, "Website domain is required"),
  companyName: z.string().trim().min(2, "Company name is required"),
  city: z.string().trim().min(2, "City is required"),
  street: z.string().trim().min(2, "Street address is required"),
  zipcode: z.string().trim().min(3, "Zipcode is required"),
});

export type UserFormData = z.infer<typeof userFormSchema>;
