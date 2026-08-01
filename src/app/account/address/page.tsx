import type { Metadata } from "next";
import Link from "next/link";
import { getUserAddresses } from "@/lib/addresses";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";
import DeleteAddressButton from "@/app/ui/account/delete-address-button";

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

      {addresses.length === 0 ? (
        <AccountCard className="p-6 text-center">
          <p className="text-slate-600">No addresses saved yet.</p>
        </AccountCard>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AccountCard key={address.id} className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {address.is_default && (
                    <span className="mb-2 inline-block rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                      Default
                    </span>
                  )}
                  <p className="font-bold text-slate-900">{address.full_name}</p>
                  <p className="text-slate-700">{address.address_1}</p>
                  {address.address_2 && <p className="text-slate-700">{address.address_2}</p>}
                  <p className="text-slate-700">
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/account/address/${address.id}/edit`} className={editLinkClasses}>
                    Edit
                  </Link>
                  <DeleteAddressButton id={address.id} />
                </div>
              </div>
            </AccountCard>
          ))}
        </div>
      )}
    </>
  );
}
