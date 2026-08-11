'use client';

import { useRouter } from "next/navigation";
import AddressForm from "@/app/ui/addresses/address-form";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

export default function NewAddressClient() {
  const router = useRouter();

  return (
    <>
      <PageTitle>Add Address</PageTitle>
      <AccountCard className="p-4 md:p-6">
        <AddressForm 
          onSuccess={() => router.push('/account/address')} 
          onCancel={() => router.push('/account/address')} 
        />
      </AccountCard>
    </>
  );
}