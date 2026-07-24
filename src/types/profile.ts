import { z } from "zod";

export const RegistrationSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }).trim(),
  last_name: z.string().min(1, { message: "Last name is required" }).trim(),
  email: z.email({ message: "Invalid email format" }).lowercase().trim(),
  password: z.string()
  .min(8)
  .regex(/[0-9]/, { message: "Must contain at least one number "})
  .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .trim(),
  confirm_password: z.string().trim(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const LoginSchema = z.object({ // Pretty sure I will have to use different validators and messages for Login
  email: z.email({ message: "Invalid email format" }).lowercase().trim(),
  password: z.string()
  .min(8)
  .regex(/[0-9]/, { message: "Must contain at least one number "})
  .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .trim(),
});