import { Metadata } from "next";
import CartClient from "@/app/ui/cart/cart-client";

/**
 * Metadata for the shopping cart page.
 */
export const metadata: Metadata = {
  title: "Cart",
};

/**
 * The server component for the shopping cart page.
 * Its primary role is to render the `CartClient` component, which handles all cart logic.
 */
export default function CartPage() {
  return <CartClient />;
}