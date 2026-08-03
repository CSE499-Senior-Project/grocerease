import type { Metadata } from "next";
import AddressForm from "@/app/ui/account/address-form";

export const metadata: Metadata = {
  title: "Add Address",
};

export default function NewAddressPage() {
  return <AddressForm />;
}
