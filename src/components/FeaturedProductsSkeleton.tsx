/**
 * Renders a skeleton loading state for the featured products section.
 * This component provides a visual placeholder while the actual product data is being fetched,
 * improving the user experience by indicating that content is on its way.
 * It is marked with `aria-busy="true"` for better accessibility.
 */
export default function FeaturedProductsSkeleton() {
  return (
    <section
      aria-label="Loading featured products"
      aria-busy="true"
      className="bg-surface-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200" />

          <div className="mt-5 h-10 w-80 max-w-full animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-4 h-6 w-full max-w-xl animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-slate-200" />

              <div className="space-y-4 p-5">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                <div className="flex items-center justify-between gap-4">
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}