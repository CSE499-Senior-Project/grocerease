"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import Logo from "@/components/layout/Logo";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-surface">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#categories"
            className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
          >
            Categories
          </Link>

          <Link
            href="/#benefits"
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

          <Link
            href="/cart"
            aria-label={`Shopping cart with ${cartCount} ${
              cartCount === 1 ? "item" : "items"
            }`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ShoppingCart
              aria-hidden="true"
              className="h-5 w-5"
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}