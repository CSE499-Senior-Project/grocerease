import type { Metadata } from "next";
import { getCustomerOrders } from "@/lib/order";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";
import OrderSummaryCard from "@/app/ui/account/order-summary-card";

export const metadata: Metadata = {
  title: "Orders & Purchases",
};

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <>
      <PageTitle>Orders & Purchases</PageTitle>

      {orders.length === 0 ? (
        <AccountCard className="p-6 text-center">
          <p className="text-slate-600">You haven&apos;t placed any orders yet.</p>
        </AccountCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderSummaryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
