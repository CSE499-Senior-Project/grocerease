import { Metadata } from "next";
import CheckoutOrder from "@/app/ui/checkout/checkout-order";
import { getUserAddresses } from "@/lib/addresses";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const addresses = await getUserAddresses();

  return <CheckoutOrder initialAddresses={addresses} />
}
