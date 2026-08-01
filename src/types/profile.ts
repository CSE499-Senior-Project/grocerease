import { z } from "zod";

const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[0-9]/, { message: "Must contain at least one number "})
  .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .trim();

export const SignUpSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }).trim(),
  last_name: z.string().min(1, { message: "Last name is required" }).trim(),
  email: z.email({ message: "Invalid email format" }).lowercase().trim(),
  password: PasswordSchema,
  confirm_password: z.string().trim(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const SignInSchema = z.object({
  email: z.email({ message: "Invalid email format" }).lowercase().trim(),
  password: z.string().min(1, { message: "Password is required "}).trim(),
});

export const ProfileUpdateSchema = z.object({
  first_name: z.string().trim().min(1, { message: "First name is required" }).max(100),
  last_name: z.string().trim().min(1, { message: "Last name is required" }).max(100),
  phone_number: z.string().trim().max(20)
    .regex(/^\+?[0-9()\-.\s]{7,20}$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  preferred_contact_method: z.enum(["email", "phoneNumber"], { message: "Select a contact method" }),
}).refine(
  (data) => data.preferred_contact_method !== "phoneNumber" || !!data.phone_number,
  {
    message: "A phone number is required when phone is your preferred contact method",
    path: ["phone_number"],
  }
);

export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, { message: "Current password is required" }).trim(),
  new_password: PasswordSchema,
  confirm_new_password: z.string().trim(),
}).refine((data) => data.new_password === data.confirm_new_password, {
  message: "Passwords do not match",
  path: ["confirm_new_password"],
});

export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignInData = z.infer<typeof SignInSchema>;
export type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  preferred_contact_method: "email" | "phoneNumber";
  role: "customer" | "merchant" | "admin";
  created_at: string;
};