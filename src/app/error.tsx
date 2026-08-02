"use client";

import Link from "next/link";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
          Error 500
        </span>

        <p
          aria-hidden="true"
          className="mt-6 text-8xl font-bold tracking-tight text-brand-primary sm:text-9xl"
        >
          500
        </p>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Oops! Something went wrong on our end.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          We couldn&apos;t complete your request right now. Please try again or
          return to a working part of GrocerEase.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-xl border border-brand-primary px-6 py-3 font-semibold text-brand-dark transition-colors hover:bg-brand-light"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}