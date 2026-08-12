import { getProfile } from "@/lib/profile";
import MerchantSidebar from "@/app/ui/merchant/merchant-sidebar";

/**
 * Ensures that this layout is always dynamically rendered,
 * preventing it from being statically cached. This is important for
 * layouts that perform authentication checks.
 */
export const dynamic = 'force-dynamic';

/**
 * The primary layout for all pages within the `/merchant` route group.
 * It fetches the user's profile to conditionally render the merchant UI.
 * @param children - The specific page component to be rendered.
 */
export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the user's profile to check their role and display info in the sidebar.
  const profile = await getProfile();

  // Safely format the user's creation date for display.
  let memberSince = "";
  if (profile?.created_at) {
    memberSince = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(profile.created_at));
  }

  // Determine if the user has merchant or admin privileges.
  const isAdmin = (profile?.role === 'merchant' || profile?.role === 'admin');

  return (
    <>
      <section className="mb-auto w-full mx-auto bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* If the user is an admin/merchant, render the sidebar and content layout. */}
          {isAdmin ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <MerchantSidebar firstName={profile.first_name} memberSince={memberSince} />
              <div className="w-full flex-1 min-w-0">{children}</div>
            </div>
          ) : (
            // Otherwise, just render the child component (e.g., the "Partner with us" page).
            <div>
              <div className="w-full flex-1 min-w-0">{children}</div>
            </div>
          )}
        </div>
      </section>
    </>    
  );
}
