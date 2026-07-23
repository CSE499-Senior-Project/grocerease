import type { Metadata } from "next";
import { Roboto_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    default: "GrocerEase"
  },
  description: "GrocerEase Platform. Fresh groceries delivered directly to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-bevahior="smooth"
      className={`${plusJakartaSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface-bg !text-txt-primary">
        <header className="border-b border-slate-200 bg-surface">
          <Navbar />
        </header>
        <main className="flex flex-col items-center justify-center m-4 flex-1">
          <CartProvider>{children}</CartProvider>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <Footer />
        </footer>
      </body>
    </html>
  );
}