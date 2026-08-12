'use client';

import { useState } from "react";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CheckoutForm from "./checkout-form";
import type { Address } from "@/types/address";

/**
 * Defines the props for the CheckoutOrder component.
 */
interface CheckoutOrderProps {
  // An array of the user's saved addresses, fetched on the server.
  initialAddresses: Address[];
}

/**
 * A client component that orchestrates the entire checkout flow.
 * It manages the state to display either the checkout form, a success message,
 * or an empty cart message.
 * @param {CheckoutOrderProps} props - The component props.
 */
export default function CheckoutOrder({ initialAddresses }: CheckoutOrderProps) {
  const { cartItems } = useCart();
  // State to track if the order has been successfully placed.
  const [isComplete, setIsComplete] = useState(false);

  
  // If the order is complete, show the success/confirmation screen.
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

  // If the cart is empty, prompt the user to add items before checking out.
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

  // If the cart has items and the order is not yet complete, render the main checkout form.
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
          Checkout
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Complete your order
        </h1>
      </div>

      <div>
        <CheckoutForm 
          // Pass a callback to update the state when the form submission is successful.
          onComplete={() => setIsComplete(true)} 
          addresses={initialAddresses}  
        />
      </div>
    </section>
  );
}