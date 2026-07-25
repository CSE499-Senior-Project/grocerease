import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";

import { CartProvider } from "@/context/CartContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface-bg font-sans text-txt-primary">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}