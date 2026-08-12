import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers";

/**
 * This is the callback route for Supabase authentication.
 * When a user signs in via an OAuth provider or a magic link, they are redirected here.
 * This route handler exchanges the authorization code from the URL for a user session.
 * @param request - The incoming Next.js request object.
 */
export async function GET(request: Request) {
  // Parse the request URL to get search parameters and the origin.
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // The `next` parameter is an optional path to redirect the user to after authentication.
  const next = searchParams.get("next") ?? "/";

  // If an authorization code is present, exchange it for a session.
  if (code) {
    // Get a reference to the server-side cookie store.
    const cookieStore = await cookies();

    // Create a Supabase client configured for server-side rendering (SSR).
    // This client can securely read and write cookies.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          // A function to retrieve all cookies from the store.
          getAll() {
            return cookieStore.getAll();
          },
          // A function to set cookies in the store.
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {

            }
          },
        },
      }
    );

    // Exchange the authorization code for a session. Supabase will store the session in cookies.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect the user back to the application, either to the `next` path or the home page.
  return NextResponse.redirect(`${origin}${next}`);
}