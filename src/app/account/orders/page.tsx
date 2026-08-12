import type { Metadata } from "next";
import { getCustomerOrders } from "@/lib/order";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";
import OrderSummaryCard from "@/app/ui/account/order-summary-card";

/**
 * Metadata for the "Orders & Purchases" page.
 */
export const metadata: Metadata = {
  title: "Orders & Purchases",
};

/**
 * The server component for the "Orders & Purchases" page.
 * It fetches a list of the customer's past orders and displays them.
 */
export default async function OrdersPage() {
  // Fetch all orders for the currently authenticated user.
  const orders = await getCustomerOrders();

  return (
    <>
      <PageTitle>Orders & Purchases</PageTitle>

      {/* Conditionally render a message if there are no orders, or the list of orders if there are. */}
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
