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
              <div>
                <div>
                  <div className="flex gap-2">
                    <h2 className="font-bold text-slate-900">Order ID:</h2>
                    <p>{order.id}</p>
                  </div>
                  <div className='flex items-center justify-between py-4 last:border-b-0'>
                    <div>
                      <p className='font-bold text-slate-900'>Customer Name</p>
                      <p className='text-slate-700'>{order.profiles?.first_name} {order.profiles?.last_name}</p>
                    </div>
                    <div>
                      <p className='font-bold text-slate-900'>Customer Email Address</p>
                      <p className='text-slate-700'>{order.profiles?.email}</p>
                    </div>
                    <div>
                      <p className='font-bold text-slate-900'>Customer Phone Number</p>
                      <p className='text-slate-700'>{formatPhoneNumber(order.profiles?.phone_number)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-slate-900">Ordered Items</h2>
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <li key={item.id} className="flex justify-between text-sm text-slate-700 gap-2 border-b border-slate-200">
                              <span className="font-semibold">
                                {item.quantity}x {item.products?.name}
                              </span>
                              <span>
                                ${item.price_at_time.toFixed(2)}
                              </span>
                            </li>
                          </div>
                        ))}
                      </div>
                      <div className='flex flex-col gap-2 items-start justify-between last:border-b-0'>
                        <p className='font-bold text-slate-900'>Total Amount</p>
                        <p className='text-slate-700'>{`$${order.total_amount.toFixed(2)}`}</p>
                      </div>
                      <div className='flex flex-col gap-2 items-start justify-between border-b border-slate-200 last:border-b-0'>
                        <p className='font-bold text-slate-900'>Delivery Address</p>
                        <p className='text-slate-700'>{order.delivery_address}</p>
                      </div>
                    </div>
                  </div>
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


