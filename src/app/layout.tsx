import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Roboto_Mono,
} from "next/font/google";

import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/server";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | GrocerEase",
    default: "GrocerEase",
  },
  description:
    "GrocerEase Platform. Fresh groceries delivered directly to your door.",
};

/**
 * The root layout component for the entire application.
 * This server component fetches the current user's authentication state and profile information
 * from Supabase. It sets up the main HTML structure, applies global fonts, and wraps the
 * application in a CartProvider to manage shopping cart state. It also passes the initial
 * sign-in state and user's first name to the AppHeader component.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // Fetches the current user from Supabase auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSignedIn = !!user;

  // If a user is signed in, fetch their first name from the 'profiles' table.
  let firstName: string | undefined;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();

    firstName = profile?.first_name;
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      {/* The CartProvider wraps the application to provide cart state globally. */}
      <CartProvider initialUserId={user?.id ?? null}>
        <body
          className="flex min-h-full flex-col bg-surface-bg font-sans !text-txt-primary"
          suppressHydrationWarning
        >
          <AppHeader
            // The key is changed based on sign-in state to force re-mounting of the header.
            key={
              isSignedIn
                ? "signed-in"
                : "signed-out"
            }
            initialIsSignedIn={isSignedIn}
            firstName={firstName}
          />

          <main className="m-4 flex flex-1 flex-col items-center justify-center">
            {children}
          </main>

          <Footer />
        </body>
      </CartProvider>
    </html>
  );
}