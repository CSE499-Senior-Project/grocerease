'use client';

import { OrderItemWithProduct } from "@/types/order";
import Image from "next/image";

interface OrderedItemsProp {
  items: OrderItemWithProduct[];
}

export default function OrderedItems({ items }: OrderedItemsProp) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Ordered Items
      </h3>
      <ul className="divide-y divide-slate-100 border-y border-slate-100">
        {items.map((item) => (
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
                  sizes='46px'
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
  );
}