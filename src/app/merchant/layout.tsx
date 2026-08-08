import { getProfile } from "@/lib/profile";
import MerchantSidebar from "@/app/ui/merchant/merchant-sidebar";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  let memberSince = "";
  if (profile?.created_at) {
    memberSince = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(profile.created_at));
  }

  const isAdmin = (profile?.role === 'merchant' || profile?.role === 'admin');

  return (
    <>
      <section className="mb-auto w-full mx-auto bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isAdmin ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <MerchantSidebar firstName={profile.first_name} memberSince={memberSince} />
              <div className="w-full flex-1">{children}</div>
            </div>
          ) : (
            <div>
              <div className="w-full flex-1">{children}</div>
            </div>
          )}
        </div>
      </section>
    </>    
  );
}
