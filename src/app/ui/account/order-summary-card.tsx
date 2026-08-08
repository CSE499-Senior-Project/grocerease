import Link from 'next/link';
import AccountCard from '@/app/ui/account/account-card';
import OrderStatusTrack from '@/app/ui/account/order-status-track';
import OrderItemThumbnails from '@/app/ui/account/order-item-thumbnails';
import type { CustomerOrder } from '@/types/order';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-us', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

interface OrderSummaryCardProps {
  order: CustomerOrder;
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <AccountCard className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0">
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-bold text-slate-900">{formatDate(order.created_at)}</p>
            <Link
              href={`/account/orders/${order.id}`}
              aria-label={`View purchase from ${formatDate(order.created_at)}`}
              className="shrink-0 text-sm font-semibold text-brand-primary hover:text-brand-dark"
            >
              View purchase
            </Link>
          </div>

          <p className="font-semibold text-slate-700">${order.total_amount.toFixed(2)}</p>

          <OrderStatusTrack currentStatus={order.status} />

          <p className="font-mono text-xs text-slate-500">#{order.id.slice(-12)}</p>
        </div>

        <OrderItemThumbnails items={order.order_items} />
      </div>
    </AccountCard>
  );
}
