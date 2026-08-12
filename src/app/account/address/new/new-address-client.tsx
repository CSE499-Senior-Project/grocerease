'use client';

import { useRouter } from "next/navigation";
import AddressForm from "@/app/ui/addresses/address-form";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

/**
 * A client component that provides the UI for adding a new address.
 * It wraps the reusable AddressForm and handles navigation on completion.
 */
export default function NewAddressClient() {
  const router = useRouter();

  return (
    <>
      <PageTitle>Add Address</PageTitle>
      {/* The form is displayed within a styled card. */}
      <AccountCard className="p-4 md:p-6">
        <AddressForm 
          // On success (address created), redirect back to the address book.
          onSuccess={() => router.push('/account/address')} 
          // On cancel, also redirect back to the address book.
          onCancel={() => router.push('/account/address')} 
        />
      </AccountCard>
    </>
  );
}