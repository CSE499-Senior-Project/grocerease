import type { Metadata } from "next";
import OrderCard from "@/app/ui/merchant/order-card";
import DetailRow from "@/app/ui/account/detail-row";
import PageTitle from "@/app/ui/account/page-title";
import { getOrders } from "@/lib/order";

export const metadata: Metadata = {
  title: "Orders & Purchases",
};

function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return "Not provided";

  const cleaned = phoneNumber.replace(/\D/g, '');

  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber;
}

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
                  <div className="flex gap-2">
                    {/* <DetailRow label="Name" value={`${order.profiles?.first_name} ${order.profiles?.last_name}`} />
                    <DetailRow label="email" value={`${order.profiles?.email}`} />
                    <DetailRow label="phoneNumber" value={`${formatPhoneNumber(order.profiles?.phone_number)}`} /> */}
                    <h3 className="font-bold text-slate-900">{order.profiles?.first_name} {order.profiles?.last_name}</h3>
                    <p>{order.profiles?.email}</p>
                    <p>{formatPhoneNumber(order.profiles?.phone_number)}</p>
                  </div>

                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-slate-700">
                      <span>
                        {item.quantity}x {item.products?.name}
                      </span>
                      <span>
                        ${item.price_at_time.toFixed(2)}
                      </span>
                    </li>
                  ))}
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
