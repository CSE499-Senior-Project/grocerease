'use client';

interface OrderIdProps {
  orderId: string;
  orderCreatedAt: string;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-us", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function OrderId({ orderId, orderCreatedAt }: OrderIdProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center md:p-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Order ID
        </span>
        <span className="font-mono text-sm font-medium text-slate-900">
          {orderId}
        </span>
      </div>
      <div className="flex flex-col gap-1 sm:text-right">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Order Date
        </span>
        <span className="text-sm font-medium text-slate-900">
          {formatDate(orderCreatedAt)}
        </span>
      </div>
    </div>
  );
}