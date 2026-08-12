'use client';

import Image from "next/image";
import { MerchantProduct } from "@/types/merchant-products";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * Defines the props for the ProductTable component.
 */
interface ProductTableProps {
  // An array of product objects to be displayed in the table.
  products: MerchantProduct[];
}

/**
 * A client component that renders a table of merchant products.
 * It also displays a success banner if a product has just been added or edited,
 * based on URL query parameters.
 * @param {ProductTableProps} props - The component props.
 */
export default function ProductTable({ products }: ProductTableProps) {
  // useSearchParams is a Client Component hook that lets you read the current URL's query string.
  const searchParams = useSearchParams();
  const isProductNew = searchParams.get('product-added') === 'true';
  const isProductEdited = searchParams.get('product-edited') === 'true';
  const showSuccessBanner = isProductNew || isProductEdited;
  const actiontext = isProductNew ? 'added' : 'edited';

  return (
    <>
      {/* Conditionally render a success banner after a product is added or edited. */}
      {showSuccessBanner && (
        <div className='mb-6 rounded-md bg-green-50 p-4 border border-green-200'>
          <p className='text-sm font-medium text-green-800'>
            Product successfully {actiontext}!
          </p>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full whitespace-nowrap text-left test-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase trackging-wider text-slate-500">
            <tr>
              <th className="px-4 py-4 lg:px-6">Product Name</th>
              <th className="hidden px-4 py-4 lg:table-cell lg:px-6">Product Description</th>
              <th className="px-4 py-4 lg:px-6">Price</th>
              <th className="hidden px-4 py-4 sm:table-cell lg:px-6">Unit</th>
              <th className="px-4 py-4 lg:px-6">Quantity</th>
              <th className="px-4 py-4 lg:px-6">Status</th>
              <th className="px-4 py-4 lg:px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {/* Map over the products array to create a table row for each product. */}
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-slate-50"
              >            
                <td className="px-4 py-4 lg:px-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 sm:h-12 sm:w-12">
                      <Image
                        src={
                          product.image_url ??
                          "/images/products/placeholder.webp"
                        }
                        alt={product.name ?? "Product"}
                        fill
                        sizes="(max-width: 640px) 40px, 48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-[120px] whitespace-normal font-bold text-slate-900">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td className="hidden max-w-[150px] truncate px-4 py-4 lg:table-cell lg:max-w-xs lg:px-6">
                  {product.description || "No description."}
                </td>
                <td className="px-4 py-4 font-bold text-brand-primary lg:px-6">
                  ${product.price.toFixed(2)}
                </td>
                <td className="hidden px-4 py-4 font-medium text-slate-700 sm:table-cell lg:px-6">
                  {product.unit}
                </td>
                <td className="px-4 py-4 font-medium text-slate-700 lg:px-6">
                  {product.stock_quantity}
                </td>
                <td className="px-4 py-4 lg:px-6">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${
                      product.is_active
                      ? "bg-brand-light text-brand-dark"
                      : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 lg:px-6">
                  {/* Action button to navigate to the edit page for this specific product. */}
                  <Link
                    href={`/merchant/product-catalog/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-brand-primary transition-colors hover:bg-brand-light hover:text-brand-dark cursor-pointer"
                    >
                    <PencilSquareIcon className="h-5 w-5"/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}