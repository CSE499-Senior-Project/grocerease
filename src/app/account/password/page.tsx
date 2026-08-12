import type { Metadata } from "next";
import ChangePasswordForm from "@/app/ui/account/change-password-form";

/**
 * Metadata for the "Change Password" page.
 */
export const metadata: Metadata = {
  title: "Password",
};

/**
 * The server component for the "Change Password" page.
 * Its sole responsibility is to render the client-side form component.
 */
export default function PasswordPage() {
  return <ChangePasswordForm />;
}
