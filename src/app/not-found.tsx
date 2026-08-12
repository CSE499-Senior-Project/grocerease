import Link from "next/link";

/**
 * Renders the 404 Not Found page.
 * This component is automatically displayed by Next.js when a route is not matched.
 * It provides a user-friendly message and navigation links to help the user
 * find their way back to existing parts of the application.
 */
export default function NotFound() {
  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
          Error 404
        </span>

        <p
          aria-hidden="true"
          className="mt-6 text-8xl font-bold tracking-tight text-brand-primary sm:text-9xl"
        >
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Oops! We can&apos;t find the page you&apos;re looking for.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          The page may have moved, the address may be incorrect, or the content
          may no longer be available.
        </p>

        {/* Provides navigation options for the user to recover from the 404 error. */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Back to Home
          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-brand-primary px-6 py-3 font-semibold text-brand-dark transition-colors hover:bg-brand-light"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}