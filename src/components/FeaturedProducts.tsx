import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

/**
 * A server component that fetches and displays a list of featured products.
 * It calls the `getFeaturedProducts` function to retrieve data.
 * It includes robust state handling, displaying an error message if the fetch fails,
 * a "no products" message if none are available, or the grid of product cards on success.
 */
export default async function FeaturedProducts() {
  const { products, error } = await getFeaturedProducts(8);

  return (
    <section
      id="products"
      className="bg-surface-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
              Popular products
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Fresh picks for your basket
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Browse available groceries, compare prices, and choose the
              products you need.
            </p>
          </div>

          <Link
            href="/products"
            className="font-semibold text-brand-primary transition-colors hover:text-brand-dark"
          >
            View all products →
          </Link>
        </div>

        {/* Renders the appropriate UI based on whether there was an error, no products, or products were found. */}
        {error ? (
          <div
            role="alert"
            className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center"
          >
            <h3 className="text-lg font-bold text-red-800">
              Unable to load products
            </h3>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <p className="mt-2 text-sm text-red-600">
              Please refresh the page or try again later.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No products available
            </h3>

            <p className="mt-3 text-slate-600">
              New grocery items will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}