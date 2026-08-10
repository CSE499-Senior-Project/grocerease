"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import type { Address } from "@/types/address";
import AddressList from "../addresses/address-list";

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

interface CheckoutFormProps {
  onComplete: () => void;
  addresses: Address[];
}

export default function CheckoutForm({ onComplete, addresses }: CheckoutFormProps) {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    addresses.find(a => a.is_default)?.id
  );
  const supabase = createClient();
  const [form, setForm] = useState<CheckoutFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");

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

  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors, isSubmitting },
  // } = useForm<CheckoutData>({
  //   resolver: zodResolver(CheckoutSchema),
  // });

  // const onSubmit = async (data: CheckoutData) => {
  //   try {

  //   } catch (error) {
  //     setError('root', { message: 'An unexpected error occurred while placing your order. '});
  //   }
  // }

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
    onComplete();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Delivery details</h2>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <AddressList 
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={(address) => setSelectedAddressId(address.id)}
              actions={(address) => (
                selectedAddressId === address.id ? (
                  <span className="text-sm font-semibold text-brand-primary">Selected</span>
                ) : null
              )}
            />
          </div>
        </div>
        
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

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark cursor-pointer"
          >
            Place order
          </button>

          <Link
            href="/cart"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to cart
          </Link>
        </aside>
      </form>
    </>
  );
}
