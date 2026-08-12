'use client';

import { useRouter } from "next/navigation";
import type { Address } from "@/types/address";
import AddressForm from "@/app/ui/addresses/address-form";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

/**
 * Props for the EditAddressClient component.
 */
interface EditAddressClientProps {
  // The address object to be edited.
  address: Address;
}

/**
 * A client component that provides the UI for editing an address.
 * It wraps the reusable AddressForm and handles navigation on completion.
 * @param {EditAddressClientProps} props - The component props.
 */
export default function EditAddressClient({ address }: EditAddressClientProps) {
  const router = useRouter();

  return (
    <>
      <PageTitle>Edit Address</PageTitle>
      {/* The form is displayed within a styled card. */}
      <AccountCard className="p-4 md:p-6">
        <AddressForm 
          address={address}
          // Callbacks to redirect the user after the form action is complete.
          onSuccess={() => router.push('/account/address')} 
          onCancel={() => router.push('/account/address')} 
        />
      </AccountCard>
    </>
  );
}