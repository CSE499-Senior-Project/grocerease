"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Address } from "@/types/address";
import AddressList from "@/app/ui/addresses/address-list";
import AddressForm from "@/app/ui/addresses/address-form";

interface CheckoutFormProps {
  onComplete: () => void;
  addresses: Address[];
}

export default function CheckoutForm({ onComplete, addresses }: CheckoutFormProps) {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    addresses.find(a => a.is_default)?.id
  );

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
    [cartItems]
  );

  function handlePlaceOrder() {
    if (!selectedAddressId) {
      setErrorMessage("Please select a delivery address before placing your order.");
      return;
    }

    setErrorMessage("");
    clearCart();
    onComplete();
  }

  function handleAddressAdded() {
    setIsAddingAddress(false);
    router.refresh(); 
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm self-start lg:col-span-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Delivery details</h2>
          {!isAddingAddress && (
            <button
              type="button"
              onClick={() => setIsAddingAddress(true)}
              className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-primary hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add new
            </button>
          )}
        </div>

        {errorMessage && !isAddingAddress ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {isAddingAddress ? (
          <AddressForm 
            onSuccess={handleAddressAdded} 
            onCancel={() => setIsAddingAddress(false)} 
          />
        ) : (
          <AddressList 
            addresses={addresses}
            selectedId={selectedAddressId}
            onSelect={(address) => {
              setSelectedAddressId(address.id);
              setErrorMessage("");
            }}
            actions={(address) => (
              selectedAddressId === address.id ? (
                <span className="text-sm font-semibold text-brand-primary">Selected</span>
              ) : null
            )}
          />
        )}
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm self-start lg:col-span-4">
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
          type="button"
          onClick={handlePlaceOrder}
          disabled={isAddingAddress}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300"
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
    </div>
  );
}