'use client';

import Link from "next/link";
import type { Address } from "@/types/address";
import AddressList from "@/app/ui/addresses/address-list";
import DeleteAddressButton from "@/app/ui/account/delete-address-button";

/**
 * Reusable class names for the "Edit" link button.
 */
const editLinkClasses =
  "shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white";

/**
 * Props for the AddressBookClient component.
 */
interface AddressBookClientProps {
  // An array of address objects to be displayed.
  addresses: Address[];
}

/**
 * A client component that displays a list of user addresses.
 * It uses the generic AddressList component and injects specific actions (Edit, Delete) for each address.
 * @param {AddressBookClientProps} props - The component props.
 */
export default function AddressBookClient({ addresses }: AddressBookClientProps) {
  return (
    <AddressList
      addresses={addresses}
      // Defines the action buttons to be rendered for each address in the list.
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