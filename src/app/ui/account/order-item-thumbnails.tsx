import Image from 'next/image';
import type { OrderItemWithProduct } from '@/types/order';

const MAX_VISIBLE_ITEMS = 5;

interface OrderItemThumbnailsProps {
  items: OrderItemWithProduct[];
}

export default function OrderItemThumbnails({ items }: OrderItemThumbnailsProps) {
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
  const remainingCount = items.length - visibleItems.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleItems.map((item) => (
        <div
          key={item.id}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
        >
          <Image
            src={item.products?.image_url ?? '/images/products/placeholder.webp'}
            alt={item.products?.name ?? 'Product'}
            fill
            sizes="48px"
            className="object-cover"
          />
          {item.quantity > 1 && (
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/90 text-xs font-bold text-white">
              {item.quantity}
            </span>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="flex h-12 shrink-0 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}
