import { getProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'merchant' || profile?.role === 'admin';

  if (!isAdmin) {
    redirect('/merchant');
  }

  return <>{children}</>;
}