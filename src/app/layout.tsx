import type { Metadata } from "next";
import { Roboto_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

// The polished equivalent of Courier/monospace for body/prices
const robotoMono = Roboto_Mono({
subsets: ["latin"],
variable: '--font-roboto-mono',
display: 'swap',
});

// This sets the HTML  meta tags for your app
export const metadata: Metadata = {
  title: "GrocerEase Platform",
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
      className={`${plusJakartaSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface-background text-slate-900 ">{children}</body>
    </html>
  );
}