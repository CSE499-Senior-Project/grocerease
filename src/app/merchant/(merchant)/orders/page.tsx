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
          {orders.map((order) => (
            <OrderCard key={order.id} className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{order.profiles?.first_name}</h3>
                  {/* <p className="text-slate-700">{order.order_items.products.product_name}</p> */}
                  <p className="text-slate-700">{order.delivery_address}</p>
                </div>
                {/* <div className="flex shrink-0 gap-2">
                  <Link href={`/merchant/order/${order.id}/edit`} className={editLinkClasses}>
                    Edit
                  </Link>
                </div> */}
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </>
  );
}
