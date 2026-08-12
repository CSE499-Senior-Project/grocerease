import type { Metadata } from 'next';
import OrderCard from '@/app/ui/merchant/order-card';
import PageTitle from '@/app/ui/account/page-title';
import { getOrders } from '@/lib/order';
import OrderStatusStepper from '@/app/ui/merchant/order-status-stepper';
import OrderId from '@/app/ui/merchant/order-id';
import CustomerInfo from '@/app/ui/merchant/customer-info';
import OrderedItems from '@/app/ui/merchant/ordered-items';

/**
 * Metadata for the merchant's Orders & Purchases page.
 */
export const metadata: Metadata = {
  title: 'Orders & Purchases',
};

/**
 * Formats a phone number string into a standard US format.
 * @param phoneNumber - The raw phone number string.
 * @returns A formatted phone number string or "Not provided".
 */
function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return 'Not provided';

  const cleaned = phoneNumber.replace(/\D/g, '');

  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber;
}

/**
 * Formats a date string to include date, time, and AM/PM.
 * @param dateString - The ISO date string to format.
 * @returns A formatted date and time string (e.g., "Aug 11, 10:41 PM").
 */
function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-us', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * The server component for the merchant's "Order Queue" page.
 * It fetches all pending orders and displays them in a detailed, actionable format.
 */
export default async function OrdersPage() {
  // Fetch all orders intended for merchant view.
  const orders = await getOrders();

  return (
    <>
      <PageTitle>Order Queue</PageTitle>

      {/* Conditionally render a message if the order queue is empty. */}
      {orders.length === 0 ? (
        <OrderCard className='p-6 text-center'>
          <p className='text-slate-600'>
            All caught up. You have no pending orders.
          </p>
        </OrderCard>
      ) : (
        // If there are orders, map over them and render a detailed card for each.
        <div className='space-y-8'>
          {orders.map((order) => (
            <OrderCard key={order.id} className='flex flex-col overflow-hidden'>
              {/* Header section of the card with Order ID and creation date. */}
              <OrderId orderId={order.id} orderCreatedAt={order.created_at} />

              {/* Main content area with customer info and the list of items ordered. */}
              <div className='flex flex-col gap-8 p-4 md:p-6'>
                <CustomerInfo
                  firstName={order.profiles?.first_name}
                  lastName={order.profiles?.last_name}
                  email={order.profiles?.email}
                  phoneNumber={formatPhoneNumber(order.profiles?.phone_number)}
                  deliveryAddress={order.delivery_address}
                  deliveryTimeSlot={order.delivery_time_slot}
                />
                <OrderedItems items={order.order_items} />
              </div>

              {/* Footer section containing the order status updater and cost summary. */}
              <div className='flex flex-col-reverse items-start justify-between gap-6 border-t border-slate-200 bg-slate-50 p-4 xl:flex-row xl:items-center md:p-6'>
                <div className='flex w-full flex-col gap-3'>
                  {/* Display when the order status was last updated. */}
                  {order.updated_at &&
                    order.updated_at !== order.created_at && (
                      <span className='text-xs font-medium text-slate-500'>
                        Status last updated:{' '}
                        <span className='font-semibold text-slate-700'>
                          {formatDate(order.updated_at)}
                        </span>
                      </span>
                    )}
                  {/* Interactive component for merchants to update the order's status. */}
                  <OrderStatusStepper
                    orderId={order.id}
                    currentStatus={order.status as any}
                  />
                </div>
                {/* A summary of the order's costs. */}
                <div className='flex w-full shrink-0 flex-col items-end gap-2 xl:w-auto'>
                  <div className='flex flex-col items-end text-sm text-slate-500'>
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    <span>Tax: ${order.tax_amount.toFixed(2)}</span>
                    <span>Delivery: ${order.service_fee.toFixed(2)}</span>
                  </div>

                  <div className='flex w-full flex-row items-center justify-between xl:flex-col xl:items-end gap-1'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                      Total Amount
                    </span>
                    <span className='text-2xl font-bold text-brand-primary'>
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </>
  );
}