"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/client";

export default function CartClient() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const deliveryFee = cartTotal > 40 ? 0 : 4.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  async function handleCheckout() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/signin?message=false');
      return;
    }
    router.push('/checkout');
  }

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center lg:px-8">
        <div className="rounded-full bg-brand-light p-5 text-brand-primary">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-xl text-lg text-slate-600">
          Add a few essentials from our catalog and they&apos;ll appear here ready for checkout.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Back home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Shopping cart
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {cartCount} {cartCount === 1 ? "item" : "items"} ready to checkout
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-red-300 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      {/* 12-column grid applied here */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-24">
                <Image
                  src={item.image ?? "/images/products/placeholder.webp"}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-500">{item.unit}</p>
                  </div>
                  <p className="text-lg font-bold text-brand-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity for ${item.name}`}
                      className="rounded-md p-2 text-slate-600 transition-colors hover:bg-white hover:text-brand-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity for ${item.name}`}
                      className="rounded-md p-2 text-slate-600 transition-colors hover:bg-white hover:text-brand-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 4-column span applied to the aside */}
        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm self-start lg:col-span-4">
          <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${totalWithDelivery.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark cursor-pointer"
          >
            Proceed to checkout
          </button>
          <Link
            href="/products"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}