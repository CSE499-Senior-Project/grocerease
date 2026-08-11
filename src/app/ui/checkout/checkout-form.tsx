"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, CreditCard, Banknote } from "lucide-react";
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

  const [deliveryDay, setDeliveryDay] = useState<"today" | "tomorrow">("today");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>("");

  const availableSlots = useMemo(() => {
    const slots: Date[] = [];
    const now = new Date();
    const targetDate = new Date();

    if (deliveryDay === "tomorrow") {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    for (let hour = 7; hour <= 21; hour++) {
      const slotTime = new Date(targetDate);
      slotTime.setHours(hour, 0, 0, 0);

      if (deliveryDay === "today" && slotTime.getTime() <= now.getTime() + 60 * 60 * 1000) {
        continue;
      }
      slots.push(slotTime);
    }
    return slots;
  }, [deliveryDay]);

  const formatSlotLabel = (date: Date) => {
    const startTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 1);
    const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  };
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "delivery">("card");

  const baseDeliveryFee = cartTotal > 40 ? 0 : 4.99;
  const premiumFee = deliveryTimeSlot === "ASAP (Premium)" ? 10.00 : 0;
  const deliveryFee = baseDeliveryFee + premiumFee;
  const taxRate = 0.06;
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + deliveryFee + taxAmount;

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
      
      <div className="flex flex-col gap-10 self-start lg:col-span-8">
        
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">1. Delivery address</h2>
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">2. Delivery options</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            
            <div className="mb-6 flex gap-4 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => {
                  setDeliveryDay("today");
                  setDeliveryTimeSlot("");
                }}
                className={`pb-2 font-semibold transition-colors ${
                  deliveryDay === "today"
                    ? "border-b-2 border-brand-primary text-brand-primary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeliveryDay("tomorrow");
                  setDeliveryTimeSlot(""); 
                }}
                className={`pb-2 font-semibold transition-colors ${
                  deliveryDay === "tomorrow"
                    ? "border-b-2 border-brand-primary text-brand-primary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tomorrow
              </button>
            </div>

            {availableSlots.length === 0 ? (
              <p className="text-sm text-slate-500">No delivery slots remaining for today. Please select tomorrow.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableSlots.map((slot) => {
                  const isoString = slot.toISOString();
                  const isSelected = deliveryTimeSlot === isoString;
                  
                  return (
                    <button
                      key={isoString}
                      type="button"
                      onClick={() => setDeliveryTimeSlot(isoString)}
                      className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-brand-primary bg-brand-light/30 text-brand-primary ring-1 ring-brand-primary shadow-sm"
                          : "border-slate-200 text-slate-700 hover:border-brand-primary"
                      }`}
                    >
                      {formatSlotLabel(slot)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">3. Payment method</h2>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  paymentMethod === "card" 
                    ? "border-brand-primary bg-brand-light/30 ring-1 ring-brand-primary shadow-sm" 
                    : "border-slate-200 hover:border-brand-primary"
                }`}
              >
                <CreditCard className={`h-6 w-6 shrink-0 ${paymentMethod === "card" ? "text-brand-primary" : "text-slate-400"}`} />
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Credit Card</p>
                  <p className="mt-1 text-xs text-slate-500">Pay securely now</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("delivery")}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  paymentMethod === "delivery" 
                    ? "border-brand-primary bg-brand-light/30 ring-1 ring-brand-primary shadow-sm" 
                    : "border-slate-200 hover:border-brand-primary"
                }`}
              >
                <Banknote className={`h-6 w-6 shrink-0 ${paymentMethod === "delivery" ? "text-brand-primary" : "text-slate-400"}`} />
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Pay on Delivery</p>
                  <p className="mt-1 text-xs text-slate-500">Pay when it arrives</p>
                </div>
              </button>
            </div>
            
            {paymentMethod === "card" && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                <p>This is a mock checkout. No real payment information is required.</p>
              </div>
            )}
          </div>
        </section>

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
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
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