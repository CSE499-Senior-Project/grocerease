import { getProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

/**
 * A layout that acts as a security guard for the merchant-only routes.
 * It checks the user's role and redirects them if they do not have access.
 * @param children - The protected page component to render if the user is authorized.
 */
export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the user's profile to check their role.
  const profile = await getProfile();
  // Determine if the user has merchant or admin privileges.
  const isAdmin = profile?.role === 'merchant' || profile?.role === 'admin';

  // If the user is not an admin or merchant, redirect them away from this section.
  if (!isAdmin) {
    redirect('/merchant');
  }

  // If the user is authorized, render the requested child page.
  return <>{children}</>;
}