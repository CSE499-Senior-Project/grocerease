import Link from "next/link";

export default function Hero() {
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
                {["Fresh Produce", "Bakery", "Dairy", "Pantry"].map(
                  (category) => (
                    <div
                      key={category}
                      className="flex min-h-32 items-end rounded-xl bg-white p-4 shadow-sm"
                    >
                      <p className="font-semibold text-slate-900">{category}</p>
                    </div>
                  ),
                )}
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