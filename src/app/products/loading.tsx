export default function ProductsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading product catalog"
      className="min-h-screen bg-surface-background"
    >
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="h-8 w-36 animate-pulse rounded-full bg-slate-200" />

          <div className="mt-5 h-12 w-80 max-w-full animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded-lg bg-slate-200" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto]">
            <div>
              <div className="mb-2 h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
            </div>

            <div>
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
            </div>

            <div>
              <div className="mb-2 h-4 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
            </div>

            <div className="h-12 animate-pulse rounded-xl bg-slate-200 lg:self-end" />
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-44 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-9 w-36 animate-pulse rounded-full bg-slate-200" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-square animate-pulse bg-slate-200" />

              <div className="p-5">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="h-7 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-10 animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
