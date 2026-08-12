"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, CreditCard, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, type CheckoutData } from "@/types/order";
import { useCart } from "@/context/CartContext";
import type { Address } from "@/types/address";
import AddressList from "@/app/ui/addresses/address-list";
import AddressForm from "@/app/ui/addresses/address-form";
import { placeOrder } from "@/actions/actions";
import z from "zod";

// Define a Zod schema for just the fields this form is responsible for validating.
const FormSchema = CheckoutSchema.pick({
  delivery_address: true,
  delivery_time_slot: true,
});

// Infer the TypeScript type from the Zod schema.
type FormData = z.infer<typeof FormSchema>;

/**
 * Defines the props for the CheckoutForm component.
 */
interface CheckoutFormProps {
  // A callback function to be called when the order is successfully placed.
  onComplete: () => void;
  // The initial list of user addresses passed from the parent server component.
  addresses: Address[];
}

/**
 * The main form component for the checkout process. It handles address selection,
 * delivery options, payment, and final submission.
 * @param {CheckoutFormProps} props - The component props.
 */
export default function CheckoutForm({ onComplete, addresses }: CheckoutFormProps) {
  const {
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    // Set default values, using the user's default address if available.
    defaultValues: {
      delivery_address: addresses.find(a => a.is_default)?.id || "",
      delivery_time_slot: "",
    }
  })

  const selectedAddressId = useWatch({
    control,
    name: "delivery_address"
  });

  const selectedTimeSlot = useWatch({
    control,
    name: "delivery_time_slot"
  });

  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  // State to toggle the "Add Address" form view.
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [deliveryDay, setDeliveryDay] = useState<"today" | "tomorrow">("today");
  const [isAsap, setIsAsap] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "delivery">("card");  

  // Memoize the calculation of available delivery slots to avoid re-computing on every render.
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

      // A slot is only available today if it's at least 3 hours in the future.
      if (deliveryDay === "today" && slotTime.getTime() <= now.getTime() + 3 * 60 * 60 * 1000) {
        continue;
      }
      slots.push(slotTime);
    }
    return slots;
  }, [deliveryDay]);

  /**
   * Formats a Date object into a "StartTime - EndTime" string.
   */
  const formatSlotLabel = (date: Date) => {
    const startTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 1);
    const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  };

  /**
   * Handles the "ASAP" button click, setting the time slot to one hour from now.
   */
  const handleAsapClick = () => {
    setIsAsap(true);
    const asapTime = new Date();
    asapTime.setHours(asapTime.getHours() + 1, 0, 0, 0);
    setValue("delivery_time_slot", asapTime.toISOString(), { shouldValidate: true });
  };

  // Calculate order costs.
  const baseDeliveryFee = cartTotal > 40 ? 0 : 4.99;
  const premiumFee = isAsap ? 10.00 : 0;
  const deliveryFee = baseDeliveryFee + premiumFee;
  const taxRate = 0.06;
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + deliveryFee + taxAmount;

  // Memoize the order summary to prevent re-mapping on every render.
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

  /**
   * Callback for when a new address is successfully added.
   * It closes the form and refreshes the page data to show the new address.
   */
  function handleAddressAdded() {
    setIsAddingAddress(false);
    router.refresh(); 
  }

  /**
   * Handles the final form submission.
   * It constructs the full order payload and calls the `placeOrder` server action.
   */
  const onSubmit = async (data: FormData) => {
    const selectedAddress = addresses.find((a) => a.id === data.delivery_address);

    // Construct a full, human-readable address string for the order record.
    const absoluteAddress = selectedAddress
      ? `${selectedAddress.address_1}, ${
        selectedAddress.address_2 ? selectedAddress.address_2 + ", " : ""
      }${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip_code}`
    : "Address not found";

    const mappedItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price,
    }));

    // Combine form data with calculated costs and items into the final payload.
    const finalPayload = {
      ...data,
      delivery_address: absoluteAddress,
      subtotal: cartTotal,
      service_fee: deliveryFee,
      tax_amount: taxAmount,
      total_amount: finalTotal,
      items: mappedItems,
    };

    const response = await placeOrder(finalPayload);

    // If the server action returns an error, display it.
    if (response?.error) {
      setError("root", { message: response.error });
      return;
    }

    // On success, clear the cart and call the onComplete callback to show the success screen.
    clearCart();
    onComplete();
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-12">
        
        <div className="flex flex-col gap-10 self-start lg:col-span-8">
          
          {/* Section 1: Delivery Address */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">1. Delivery address</h2>
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-primary hover:text-white cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add new
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {errors.delivery_address && (
                <p className="mt-4 text-sm font-semibold text-red-600">
                  {errors.delivery_address.message}
                </p>
              )}

              {/* Conditionally render the AddressForm or the AddressList. */}
              {isAddingAddress ? (
                <AddressForm 
                  onSuccess={handleAddressAdded} 
                  onCancel={() => setIsAddingAddress(false)} 
                />
              ) : (
                <AddressList 
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={(address) => setValue("delivery_address", address.id, { shouldValidate: true})}
                  actions={(address) => (
                    selectedAddressId === address.id ? (
                      <span className="text-sm font-semibold text-brand-primary">Selected</span>
                    ) : null
                  )}
                />
              )}
            </div>
          </section>

          {/* Section 2: Delivery Options */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">2. Delivery options</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              
              {/* Tabs for selecting "Today" or "Tomorrow". */}
              <div className="mb-6 flex gap-4 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryDay("today");
                    setIsAsap(false);
                    setValue("delivery_time_slot", "");
                  }}
                  className={`pb-2 font-semibold transition-colors cursor-pointer ${
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
                    setIsAsap(false);
                    setValue("delivery_time_slot", "");
                  }}
                  className={`pb-2 font-semibold transition-colors cursor-pointer ${
                    deliveryDay === "tomorrow"
                      ? "border-b-2 border-brand-primary text-brand-primary"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Tomorrow
                </button>
              </div>

              {/* "ASAP" option, only available for today's deliveries before 8 PM. */}
              {deliveryDay === "today" && (
                <div className="mb-6 border-b border-slate-200 pb-6">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">Need it right away?</h3>
                  {new Date().getHours() < 20 ? (
                    <button
                      type="button"
                      onClick={handleAsapClick}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 transition-colors cursor-pointer ${
                        isAsap
                          ? "border-brand-primary bg-brand-light/30 ring-1 ring-brand-primary shadow-sm"
                          : "border-slate-200 hover:border-brand-primary"
                      }`}
                    >
                      <div className="text-left">
                        <span className={`block font-bold ${isAsap ? "text-brand-primary" : "text-slate-900"}`}>
                          ASAP Delivery
                        </span>
                        <span className="text-sm text-slate-500">Delivered within ~1 hour</span>
                      </div>
                      <span className={`font-bold ${isAsap ? "text-brand-primary" : "text-slate-900"}`}>
                        +$10.00
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      It is past 8:00 PM. ASAP delivery is no longer available for today.
                    </div>
                  )}
                </div>
              )}

              {/* Grid of available standard delivery time slots. */}
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Standard Delivery</h3>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-slate-500">No delivery slots remaining for today. Please select tomorrow.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {availableSlots.map((slot) => {
                    const isoString = slot.toISOString();
                    const isSelected = selectedTimeSlot === isoString;
                    
                    return (
                      <button
                        key={isoString}
                        type="button"
                        onClick={() => {
                          setIsAsap(false);
                          setValue("delivery_time_slot", isoString, { shouldValidate: true });
                        }}
                        className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors cursor-pointer ${
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
              {errors.delivery_time_slot && (
                <p className="mt-4 text-sm font-semibold text-red-600">
                  {errors.delivery_time_slot?.message}
                </p>
              )}
            </div>
          </section>

          {/* Section 3: Payment Method */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">3. Payment method</h2>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Credit Card payment option. */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors cursor-pointer ${
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

                {/* Pay on Delivery option. */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("delivery")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors cursor-pointer ${
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
              
              {/* Mock payment notice. */}
              {paymentMethod === "card" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  <p>This is a mock checkout. No real payment information is required.</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Order Summary Sidebar */}
        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm self-start lg:col-span-4">
          <h2 className="text-xl font-semibold text-slate-900">Your order</h2>
          <p className="mt-2 text-sm text-slate-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your basket
          </p>

          {/* List of items in the cart. */}
          <div className="mt-6 space-y-3">
            {orderSummary.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-slate-700">
                <span>{item.name} × {item.quantity}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Breakdown of all costs. */}
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

          {/* Display for any root-level form errors from the server action. */}
          {errors.root && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.root.message}
            </div>
          )}

          {/* Main submission button. */}
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isAddingAddress || isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
          
          {/* Link to go back to the cart page. */}
          <Link
            href="/cart"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}