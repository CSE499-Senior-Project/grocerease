"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

import { useCart } from "@/context/CartContext";
import Logo from "@/components/layout/Logo";

// TODO: replace with real auth state once authentication is implemented.
const isLoggedIn = false;

export default function AppHeader() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-surface">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        <Logo />

        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-slate-700 transition-colors hover:text-brand-primary"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex items-center text-slate-700 transition-colors hover:text-brand-primary"
              >
                <User className="h-6 w-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-slate-200 bg-surface py-1 shadow-lg">
                  <Link
                    href="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
