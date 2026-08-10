'use client';

import Link from "next/link";
import type { Address } from "@/types/address";
import AddressList from "@/app/ui/addresses/address-list";
import DeleteAddressButton from "@/app/ui/account/delete-address-button";

const editLinkClasses =
  "shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white";

interface AddressBookClientProps {
  addresses: Address[];
}

export default function AddressBookClient({ addresses }: AddressBookClientProps) {
  return (
    <AddressList
      addresses={addresses}
      actions={(address) => (
        <>
          <Link href={`/account/address/${address.id}/edit`} className={editLinkClasses}>
            Edit
          </Link>
          <DeleteAddressButton id={address.id} />
        </>
      )}
    />
  );
}