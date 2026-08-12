import { Metadata } from "next";
import CheckoutOrder from "@/app/ui/checkout/checkout-order";
import { getUserAddresses } from "@/lib/addresses";

/**
 * Metadata for the Checkout page.
 */
export const metadata: Metadata = {
  title: "Checkout",
};

/**
 * The server component for the checkout page.
 * It fetches the user's saved addresses on the server to provide
 * them as initial data to the client component.
 */
export default async function CheckoutPage() {
  // Fetch all addresses for the currently logged-in user.
  const addresses = await getUserAddresses();

  // Render the client component, passing the fetched addresses as initial props.
  return <CheckoutOrder initialAddresses={addresses} />
}
