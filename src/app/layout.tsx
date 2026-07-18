import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { CartProvider } from "@/context/CartContext";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrocerEase Platform",
  description:
    "GrocerEase Platform. Fresh groceries delivered directly to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface-background font-sans text-slate-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}