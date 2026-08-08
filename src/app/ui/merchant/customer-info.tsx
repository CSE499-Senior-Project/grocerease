'use client';

interface CustomerInfoProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  deliveryAddress: string;
  deliveryTimeSlot: string;
}

export default function CustomerInfo({ firstName, lastName, email, phoneNumber, deliveryAddress, deliveryTimeSlot }: CustomerInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Customer Name
        </span>
        <span className="text-sm font-medium text-slate-900 break-all">
          {firstName} {lastName}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Contact Info
        </span>
        <span className="text-sm font-medium text-slate-900 break-all">
          {email}
        </span>
        <span className="text-sm font-medium text-slate-900">
          {phoneNumber}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Delivery Address
        </span>
        <span className="text-sm font-medium text-slate-900 break-all">
          {deliveryAddress}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Delivery Window
        </span>
        <span className="text-sm font-medium text-slate-900">
          {deliveryTimeSlot}
        </span>
      </div>
    </div>
  );
}

