import type { Metadata } from "next";
import { getAuthenticatedProfile } from "@/lib/profile";
import ProfileEditForm from "@/app/ui/account/profile-edit-form";

export const metadata: Metadata = {
  title: "Edit Account Details",
};

export default async function EditAccountDetailsPage() {
  const profile = await getAuthenticatedProfile();

  return <ProfileEditForm profile={profile} />;
}
