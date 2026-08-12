import type { Metadata } from "next";
import NewAddressClient from "./new-address-client";

/**
 * Metadata for the Add Address page.
 */
export const metadata: Metadata = {
  title: "Add Address",
};

/**
 * The server component for the "Add New Address" page.
 * Its sole responsibility is to render the client-side form wrapper.
 */
export default function NewAddressPage() {
  return <NewAddressClient />;
}