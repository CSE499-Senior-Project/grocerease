import type { Metadata } from "next";
import OrderCard from "@/app/ui/merchant/order-card";
import Image from "next/image";
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

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-us", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

const STATUS_STEPS = ['pending', 'shopping', 'out for delivery', 'delivered'] as const;

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <PageTitle>Order Queue</PageTitle>

      {orders.length === 0 ? (
        <OrderCard className="p-6 text-center">
          <p className="text-slate-600">
            All caught up. You have no pending orders.
          </p>
        </OrderCard>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard key={order.id} className="flex flex-col overflow-hidden">
              
              <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center md:p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order ID
                  </span>
                  <span className="font-mono text-sm font-medium text-slate-900">
                    {order.id}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order Date
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>

              {/* <div className="border-b border-slate-200 p-4 xl:flex-row xl:items-center md:p-6">
                <form className="flex w-full items-center justify-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                  <input type="hidden" name="orderId" value={order.id} />
                  
                  {STATUS_STEPS.map((step, index) => {
                    const currentIdx = STATUS_STEPS.indexOf(order.status as any);
                    const isPast = index < currentIdx;
                    const isCurrent = index === currentIdx;
                    
                    let buttonClasses = "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold capitalize transition-all ";
                    
                    if (isCurrent) {
                      // Active, current state
                      buttonClasses += "border-brand-primary bg-brand-primary text-white shadow-md";
                    } else if (isPast) {
                      // Completed state
                      buttonClasses += "border-brand-light bg-brand-light text-brand-dark hover:bg-brand-primary hover:text-white hover:border-brand-primary cursor-pointer";
                    } else {
                      // Future, unreached state
                      buttonClasses += "border-slate-200 bg-white text-slate-400 hover:border-brand-primary hover:text-brand-primary cursor-pointer";
                    }

                    return (
                      <div key={step} className="flex items-center gap-2">
                        <button
                          type="submit"
                          name="status"
                          value={step}
                          disabled={isCurrent}
                          className={buttonClasses}
                          aria-label={`Update status to ${step}`}
                        >
                          {step}
                        </button>
                        
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`h-0.5 w-4 sm:w-6 rounded-full ${isPast ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    );
                  })}
                </form>
              </div> */}

              <div className="flex flex-col gap-8 p-4 md:p-6">
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer Name
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {order.profiles?.first_name} {order.profiles?.last_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Contact Info
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {order.profiles?.email}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatPhoneNumber(order.profiles?.phone_number)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Delivery Address
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {order.delivery_address}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Delivery Window
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {order.delivery_time_slot}
                    </span>
                  </div>
                </div>

                <div className="border-b border-t border-slate-200 p-4 xl:flex-row xl:items-center md:p-6">
                <form className="flex w-full items-center justify-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                  <input type="hidden" name="orderId" value={order.id} />
                  
                  {STATUS_STEPS.map((step, index) => {
                    const currentIdx = STATUS_STEPS.indexOf(order.status as any);
                    const isPast = index < currentIdx;
                    const isCurrent = index === currentIdx;
                    
                    let buttonClasses = "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold capitalize transition-all ";
                    
                    if (isCurrent) {
                      // Active, current state
                      buttonClasses += "border-brand-primary bg-brand-primary text-white shadow-md";
                    } else if (isPast) {
                      // Completed state
                      buttonClasses += "border-brand-light bg-brand-light text-brand-dark hover:bg-brand-primary hover:text-white hover:border-brand-primary cursor-pointer";
                    } else {
                      // Future, unreached state
                      buttonClasses += "border-slate-200 bg-white text-slate-400 hover:border-brand-primary hover:text-brand-primary cursor-pointer";
                    }

                    return (
                      <div key={step} className="flex items-center gap-2">
                        <button
                          type="submit"
                          name="status"
                          value={step}
                          disabled={isCurrent}
                          className={buttonClasses}
                          aria-label={`Update status to ${step}`}
                        >
                          {step}
                        </button>
                        
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`h-0.5 w-4 sm:w-6 rounded-full ${isPast ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    );
                  })}
                </form>
              </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ordered Items
                  </h3>
                  <ul className="divide-y divide-slate-100 border-y border-slate-100">
                    {order.order_items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                            <Image
                              src={
                                item.products?.image_url ??
                                "/images/products/placeholder.webp"
                              }
                              alt={item.products?.name ?? "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">
                              {item.products?.name}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                              Qty: {item.quantity}{" "}
                              {item.products?.unit
                                ? `(${item.products.unit})`
                                : ""}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          ${(item.price_at_time * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-6 border-t border-slate-200 bg-slate-50 p-4 xl:flex-row xl:items-center md:p-6">
                <div className="flex w-full shrink-0 flex-row items-center justify-between xl:w-auto xl:flex-col xl:justify-end gap-1">
                  <span className="text-xs text-center font-semibold uppercase tracking-wider text-slate-500">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-brand-primary">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

            </OrderCard>
          ))}
        </div>
      )}
    </>
  );

  // return (
  //   <>
  //     <PageTitle>
  //       Order Queue
  //     </PageTitle>
      
  //     {orders.length === 0 ? (
  //       <OrderCard className="p-6 text-center">
  //         <p className="text-slate-600">All caught up. You have no pending orders.</p>
  //       </OrderCard>
  //     ) : (
  //       <div className="space-y-4">
  //         {orders.map((order) => (
  //           <OrderCard key={order.id} className="p-4 md:p-6">
  //             <div>
  //               <div>
  //                 <div className="flex gap-2">
  //                   <h2 className="font-bold text-slate-900">Order ID:</h2>
  //                   <p>{order.id}</p>
  //                 </div>
  //                 <div className='flex items-center justify-between py-4 last:border-b-0'>
  //                   <div>
  //                     <p className='font-bold text-slate-900'>Customer Name</p>
  //                     <p className='text-slate-700'>{order.profiles?.first_name} {order.profiles?.last_name}</p>
  //                   </div>
  //                   <div>
  //                     <p className='font-bold text-slate-900'>Customer Email Address</p>
  //                     <p className='text-slate-700'>{order.profiles?.email}</p>
  //                   </div>
  //                   <div>
  //                     <p className='font-bold text-slate-900'>Customer Phone Number</p>
  //                     <p className='text-slate-700'>{formatPhoneNumber(order.profiles?.phone_number)}</p>
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <div className="flex items-start justify-between">
  //                     <div className="flex flex-col gap-2">
  //                       <h2 className="font-bold text-slate-900">Ordered Items</h2>
  //                       {order.order_items.map((item) => (
  //                         <div key={item.id} className="flex items-center justify-between">
  //                           <li key={item.id} className="flex justify-between text-slate-700 gap-2 border-b border-slate-200">
  //                             <span className="font-semibold">
  //                               {item.quantity}x {item.products?.name}
  //                             </span>
  //                             <span>
  //                               ${item.price_at_time.toFixed(2)}
  //                             </span>
  //                           </li>
  //                         </div>
  //                       ))}
  //                     </div>
  //                     <div className='flex flex-col gap-2 items-start justify-between last:border-b-0'>
  //                       <p className='font-bold text-slate-900'>Total Amount</p>
  //                       <p className='text-slate-700'>{`$${order.total_amount.toFixed(2)}`}</p>
  //                     </div>
  //                     <div className='flex flex-col gap-2 items-start justify-between border-b border-slate-200 last:border-b-0'>
  //                       <p className='font-bold text-slate-900'>Delivery Address</p>
  //                       <p className='text-slate-700'>{order.delivery_address}</p>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div className='flex flex-col gap-2 items-start justify-between last:border-b-0'>
  //                   <p className='font-bold text-slate-900'>Order Status</p>
  //                   <p className='text-slate-700'>{order.status}</p>
  //                 </div>
  //               </div>                  
  //               {/* <div className="flex shrink-0 gap-2">
  //                 <Link href={`/merchant/order/${order.id}/edit`} className={editLinkClasses}>
  //                   Edit
  //                 </Link>
  //               </div> */}
  //             </div>
  //           </OrderCard>
  //         ))}
  //       </div>
  //     )}
  //   </>
  // );
}


