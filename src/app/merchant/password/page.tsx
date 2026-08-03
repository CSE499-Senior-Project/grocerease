import type { Metadata } from "next";
import ChangePasswordForm from "@/app/ui/account/change-password-form";

export const metadata: Metadata = {
  title: "Password",
};

export default function PasswordPage() {
  return <ChangePasswordForm />;
}
