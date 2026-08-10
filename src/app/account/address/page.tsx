import type { Metadata } from "next";
import Link from "next/link";
import { getUserAddresses } from "@/lib/addresses";
import PageTitle from "@/app/ui/account/page-title";
import AddressBookClient from "./address-book-client";

export const metadata: Metadata = {
  title: "Address",
};

const editLinkClasses =
  "shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white";

export default async function AddressPage() {
  const addresses = await getUserAddresses();

  return (
    <>
      <PageTitle
        action={
          <Link href="/account/address/new" className={editLinkClasses}>
            Add Address
          </Link>
        }
      >
        Address Book
      </PageTitle>
      
      <AddressBookClient addresses={addresses} />
    </>
  );
}