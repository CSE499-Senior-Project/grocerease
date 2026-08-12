import Image from 'next/image';
import type { OrderItemWithProduct } from '@/types/order';

// The maximum number of thumbnails to show before collapsing the rest.
const MAX_VISIBLE_ITEMS = 5;

/**
 * Defines the props for the OrderItemThumbnails component.
 */
interface OrderItemThumbnailsProps {
  // An array of order items, including product details.
  items: OrderItemWithProduct[];
}

/**
 * A component that displays a row of product thumbnails for an order.
 * It shows a limited number of items and summarizes the rest.
 * @param {OrderItemThumbnailsProps} props - The component props.
 */
export default function OrderItemThumbnails({ items }: OrderItemThumbnailsProps) {
  // Take the first N items to display individually.
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
  // Calculate how many items are left over.
  const remainingCount = items.length - visibleItems.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleItems.map((item) => (
        <div
          key={item.id}
          // Container for a single thumbnail.
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
        >
          <Image
            // Use the product image or a placeholder if not available.
            src={item.products?.image_url ?? '/images/products/placeholder.webp'}
            alt={item.products?.name ?? 'Product'}
            fill
            sizes="48px"
            className="object-cover"
          />
          {/* If quantity is more than 1, show a quantity badge. */}
          {item.quantity > 1 && (
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/90 text-xs font-bold text-white">
              {item.quantity}
            </span>
          )}
        </div>
      ))}

      {/* If there are remaining items, show a "+N more" indicator. */}
      {remainingCount > 0 && (
        <div className="flex h-12 shrink-0 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}
