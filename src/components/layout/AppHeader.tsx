"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Package, ShoppingCart, User } from "lucide-react";
import SignOutButton from "../SignOutButton";
import { useCart } from "@/context/CartContext";
import Logo from "@/components/layout/Logo";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AppHeader({
  initialIsSignedIn,
  firstName,
}: {
  initialIsSignedIn: boolean;
  firstName?: string;
}) {
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedIn);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Immediately check the local session on mount to override any cached server state
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      // The magic check: If the browser is logged in, but the server missed it...
      if (data.session && !initialIsSignedIn) {
        router.refresh(); // Force the server to fetch name and layout
      } else {
        setIsSignedIn(!!data.session);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && !initialIsSignedIn) {
        router.refresh();
      } else {
        setIsSignedIn(!!session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialIsSignedIn, router, supabase.auth]);

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
        <div className="flex items-center gap-10">
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
        </div>

        <div className="flex items-center gap-5">
          {isSignedIn ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="cursor-pointer flex items-center gap-2 text-slate-700 transition-colors hover:text-brand-primary"
              >
                <User className="h-6 w-6" />
                {firstName && <span className="font-medium">Hi, {firstName}</span>}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-slate-200 bg-surface py-1 shadow-lg">
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary"
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary"
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <SignOutButton icon={LogOut} />
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg px-4 py-2 font-semibold text-brand-dark transition-colors hover:bg-brand-light"
            >
              Sign In
            </Link>
          )}

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
            className="relative text-slate-700 transition-colors hover:text-brand-primary"
          >
            <ShoppingCart
              aria-hidden="true"
              className="h-6 w-6"
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
