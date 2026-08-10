import type { Metadata } from "next";
import NewAddressClient from "./new-address-client";

export const metadata: Metadata = {
  title: "Add Address",
};

export default function NewAddressPage() {
  return <NewAddressClient />;
}