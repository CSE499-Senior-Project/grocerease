import Image from "next/image";
import Link from "next/link";

import { getHeroCategories } from "@/lib/products";

/**
 * Renders the main hero section for the homepage.
 * This server component includes a prominent call-to-action and fetches a few
 * category images via `getHeroCategories` to create a dynamic and visually
 * appealing introduction to the site.
 */
export default async function Hero() {
  const categories = await getHeroCategories();

  return (
    <section className="overflow-hidden bg-surface-background">
      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
            Fresh groceries, delivered with ease
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your neighborhood grocery store,
            <span className="text-brand-primary"> now online.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Browse fresh groceries, place your order, and choose a convenient
            delivery time—all from a trusted local store.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-lg bg-brand-primary px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Shop Groceries
            </Link>

            <Link
              href="#categories"
              className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-center font-semibold text-slate-800 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              Browse Categories
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-200 pt-8">
            <div>
              <p className="text-2xl font-bold text-slate-900">Fresh</p>
              <p className="mt-1 text-sm text-slate-600">Quality products</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900">Fast</p>
              <p className="mt-1 text-sm text-slate-600">Local delivery</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900">Simple</p>
              <p className="mt-1 text-sm text-slate-600">Easy ordering</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-brand-light blur-3xl" />

          <div className="relative rounded-3xl border border-green-100 bg-white p-8 shadow-xl">
            <div className="rounded-2xl bg-brand-light p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Displays a grid of category images fetched from the server. */}
                {categories.map((category) => (
                  <Link
                    key={category.category}
                    href={`/products?category=${encodeURIComponent(category.category)}`}
                    className="group relative flex min-h-32 items-end overflow-hidden rounded-xl bg-white p-4 shadow-sm"
                  >
                    {category.image && (
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 240px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {category.image && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    )}

                    <p
                      className={`relative z-10 font-semibold ${
                        category.image
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {category.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Delivery available</p>
                <p className="font-semibold text-slate-900">
                  Directly to your door
                </p>
              </div>

              <span className="rounded-full bg-brand-primary px-3 py-1 text-sm font-semibold text-white">
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}