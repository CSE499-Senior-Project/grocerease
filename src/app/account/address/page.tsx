import type { Metadata } from 'next';
import Link from 'next/link';
import { getUserAddresses } from '@/lib/addresses';
import PageTitle from '@/app/ui/account/page-title';
import AddressBookClient from './address-book-client';

/**
 * Metadata for the Address Book page.
 */
export const metadata: Metadata = {
  title: 'Address',
};

/**
 * Reusable class names for the "Add/Edit" link buttons.
 */
const editLinkClasses =
  'shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white';

/**
 * The main server component for the "Address Book" page.
 * It fetches the user's addresses and passes them to a client component for display.
 */
export default async function AddressPage() {
  // Fetch all addresses for the currently logged-in user on the server.
  const addresses = await getUserAddresses();

  return (
    <>
      <PageTitle
        // The action slot in the title contains a link to the "Add Address" page.
        action={
          <Link href='/account/address/new' className={editLinkClasses}>
            Add Address
          </Link>
        }
      >
        Address Book
      </PageTitle>

      {/* The client component receives the addresses and handles rendering the list and actions. */}
      <AddressBookClient addresses={addresses} />
    </>
  );
}
