import type { Metadata } from "next";
import OrderCard from "@/app/ui/merchant/order-card";
import DetailRow from "@/app/ui/account/detail-row";
import PageTitle from "@/app/ui/account/page-title";
import { getOrders } from "@/lib/order";

export const metadata: Metadata = {
  title: "Orders & Purchases",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <PageTitle>
        Order Queue
      </PageTitle>
      
      {orders.length === 0 ? (
        <OrderCard className="p-6 text-center">
          <p className="text-slate-600">All caught up. You have no pending orders.</p>
        </OrderCard>
      ) : (
        <div className="space-y-4">
          {orders.map((address) => (
            <OrderCard key={address.id} className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                {/* <div>
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
                </div> */}
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </>
  );
}
