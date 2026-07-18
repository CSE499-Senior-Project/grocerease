import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import { featuredProducts } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section id="products" className="bg-surface-background py-20 sm:py-24">
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}