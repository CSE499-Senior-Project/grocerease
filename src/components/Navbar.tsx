import Link from "next/link";

import Logo from "@/components/layout/Logo";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-surface">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#categories"
            className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
          >
            Categories
          </Link>

          <Link
            href="#benefits"
            className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
          >
            Why GrocerEase
          </Link>

          <Link
            href="/merchant"
            className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
          >
            For Merchants
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 font-semibold text-brand-dark transition-colors hover:bg-brand-light sm:inline-flex"
          >
            Sign In
          </Link>

          <Link
            href="/products"
            className="rounded-lg bg-brand-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Start Shopping
          </Link>
        </div>
      </nav>
    </header>
  );
}