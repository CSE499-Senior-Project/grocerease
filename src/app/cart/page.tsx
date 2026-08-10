import { Metadata } from "next";
import CartClient from "@/app/ui/cart/cart-client";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return <CartClient />;
}