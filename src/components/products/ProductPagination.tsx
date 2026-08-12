import Link from "next/link";

import type { ProductSort } from "@/lib/products";

type ProductPaginationProps = {
  search: string;
  category: string;
  sort: ProductSort;
  page: number;
  totalPages: number;
};

/**
 * Builds a URL for product catalog pagination.
 * This helper function constructs a query string that preserves the existing
 * search, category, and sort filters while updating the page number.
 * @param props - The current filter and pagination state.
 * @returns A URL string for a specific page in the product catalog.
 */
function buildProductsUrl({
  search,
  category,
  sort,
  page,
}: ProductPaginationProps) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString
    ? `/products?${queryString}`
    : "/products";
}

/**
 * Renders pagination links for the product catalog.
 * It displays "Previous" and "Next" buttons and page number links,
 * allowing users to navigate through the available product pages.
 * The component does not render if there is only one page of results.
 */
export default function ProductPagination({
  search,
  category,
  sort,
  page,
  totalPages,
}: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Product catalog pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={buildProductsUrl({
            search,
            category,
            sort,
            page: page - 1,
            totalPages,
          })}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          ← Previous
        </Link>
      )}

      {/* Generates a link for each page number. */}
      {Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      ).map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildProductsUrl({
            search,
            category,
            sort,
            page: pageNumber,
            totalPages,
          })}
          aria-current={
            pageNumber === page ? "page" : undefined
          }
          className={
            pageNumber === page
              ? "rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white"
              : "rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          }
        >
          {pageNumber}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={buildProductsUrl({
            search,
            category,
            sort,
            page: page + 1,
            totalPages,
          })}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}