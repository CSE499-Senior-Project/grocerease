import type { Metadata } from "next";
import { getAuthenticatedProfile } from "@/lib/profile";
import ProfileEditForm from "@/app/ui/account/profile-edit-form";

/**
 * Metadata for the "Edit Account Details" page.
 */
export const metadata: Metadata = {
  title: "Edit Account Details",
};

/**
 * The server component for the "Edit Account Details" page.
 * It fetches the current user's profile on the server and passes it
 * to the `ProfileEditForm` client component to be displayed and edited.
 */
export default async function EditAccountDetailsPage() {
  // Fetch the complete profile for the currently authenticated user.
  const profile = await getAuthenticatedProfile();

  // Render the form, pre-filled with the user's current profile data.
  return <ProfileEditForm profile={profile} />;
}
