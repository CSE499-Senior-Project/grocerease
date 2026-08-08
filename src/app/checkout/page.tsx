"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";

interface CheckoutFormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  instructions: string;
}

const initialFormState: CheckoutFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  instructions: "",
};

export default function CheckoutPage() {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const deliveryFee = cartTotal > 40 ? 0 : 4.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  const orderSummary = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity,
      })),
    [cartItems],
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredFields = [form.fullName, form.email, form.phone, form.address, form.city, form.postalCode];
    const hasMissingFields = requiredFields.some((value) => value.trim() === "");

    if (hasMissingFields) {
      setErrorMessage("Please complete all delivery details before placing your order.");
      return;
    }

    setErrorMessage("");
    clearCart();
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center lg:px-8">
        <div className="rounded-full bg-emerald-100 p-5 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Order placed successfully
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Thanks for shopping with GrocerEase. Your order is confirmed and we’ll get it ready for delivery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Continue shopping
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

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center lg:px-8">
        <div className="rounded-full bg-brand-light p-5 text-brand-primary">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-xl text-lg text-slate-600">
          Add items to your cart before you head to checkout.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
          Checkout
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Complete your order
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Delivery details</h2>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="Ada Lovelace"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="ada@example.com"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Phone number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="(555) 123-4567"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Postal code
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="10001"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Street address
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="123 Market Street"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="New York"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Delivery notes
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-primary"
                placeholder="Leave at the front desk, ring the bell, etc."
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Place order
          </button>
        </form>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Your order</h2>
          <p className="mt-2 text-sm text-slate-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your basket
          </p>

          <div className="mt-6 space-y-3">
            {orderSummary.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-slate-700">
                <span>{item.name} × {item.quantity}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${totalWithDelivery.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/cart"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to cart
          </Link>
        </aside>
      </div>
    </section>
  );
}
