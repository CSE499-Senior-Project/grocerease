import { getAuthenticatedProfile } from "@/lib/profile";
import AccountSidebar from "@/app/ui/account/account-sidebar";

/**
 * The primary layout for all pages within the `/account` route group.
 * It establishes the common structure, including the sidebar and main content area.
 * @param children - The specific page component to be rendered in the main content area.
 */
export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the user's profile to display their name and join date in the sidebar.
  const profile = await getAuthenticatedProfile();

  // Format the user's creation date for display.
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(profile.created_at));

  return (
    // Main section container for the account pages.
    <section className="mb-auto w-full max-w-7xl mx-auto bg-white pt-11 pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* The sidebar component, which receives user-specific data. */}
          <AccountSidebar firstName={profile.first_name} memberSince={memberSince} />
          {/* The main content area where the child page will be rendered. */}
          <div className="w-full flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
