import { getAuthenticatedProfile } from "@/lib/profile";
import AccountSidebar from "@/app/ui/account/account-sidebar";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getAuthenticatedProfile();
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(profile.created_at));

  return (
    <section className="mb-auto w-full max-w-7xl mx-auto bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <AccountSidebar firstName={profile.first_name} memberSince={memberSince} />
          <div className="w-full flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
