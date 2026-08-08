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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSignedIn = !!user;

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
      <CartProvider initialUserId={user?.id ?? null}>
        <body
          className="flex min-h-full flex-col bg-surface-bg font-sans !text-txt-primary"
          suppressHydrationWarning
        >
          <AppHeader
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