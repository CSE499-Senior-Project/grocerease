'use client';

import { useRouter } from "next/navigation";
import type { Address } from "@/types/address";
import AddressForm from "@/app/ui/addresses/address-form";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

interface EditAddressClientProps {
  address: Address;
}

export default function EditAddressClient({ address }: EditAddressClientProps) {
  const router = useRouter();

  return (
    <>
      <PageTitle>Edit Address</PageTitle>
      <AccountCard className="p-4 md:p-6">
        <AddressForm 
          address={address}
          onSuccess={() => router.push('/account/address')} 
          onCancel={() => router.push('/account/address')} 
        />
      </AccountCard>
    </>
  );
}