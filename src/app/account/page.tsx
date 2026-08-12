import { redirect } from "next/navigation";

/**
 * The base page for the account section.
 * This component immediately redirects the user to their profile page,
 * which serves as the default view for the account area.
 */
export default function AccountPage() {
  redirect("/account/profile");
}
