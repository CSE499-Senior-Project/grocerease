import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductCatalogResultsProps = {
  products: Product[];
  count: number;
  firstProductNumber: number;
  lastProductNumber: number;
  category: string;
  productsError: string | null;
};

/**
 * Displays the results of the product catalog query.
 * This component renders the list of product cards. It also handles and displays
 * different states:
 * - A summary of the number of products shown.
 * - An error message if products fail to load.
 * - A "No products found" message if the query returns no results.
 */
export default function ProductCatalogResults({
  products,
  count,
  firstProductNumber,
  lastProductNumber,
  category,
  productsError,
}: ProductCatalogResultsProps) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Available groceries
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {count === 0
              ? "No matching products"
              : `Showing ${firstProductNumber}–${lastProductNumber} of ${count} products`}
          </p>
        </div>

        {category && (
          <span className="inline-flex w-fit rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
            Category: {category}
          </span>
        )}
      </div>

      {/* Displays an error message if there was a problem fetching products. */}
      {productsError ? (
        <div
          role="alert"
          className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
        >
          <h2 className="text-xl font-bold text-red-800">
            Unable to load products
          </h2>

          <p className="mt-3 text-red-700">
            {productsError}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-800"
          >
            Try again
          </Link>
        </div>
      // Displays a message when no products match the current filters.
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No products found
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            No available groceries match your current search and filters.
            Try changing the category or search term.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            View all products
          </Link>
        </div>
      // Renders the grid of product cards if products are available.
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </>
  );
}