import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Layout for authentication-related pages (e.g., Sign In, Sign Up).
 * Its primary purpose is to prevent already authenticated users from accessing these pages.
 * @param children - The child page to be rendered (e.g., SignInForm).
 */
export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a Supabase client to check the user's authentication status on the server.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If a user is already signed in, redirect them to their account page.
  if (user) {
    redirect('/account');
  }

  // If no user is signed in, render the requested authentication page.
  return <>{children}</>;
}