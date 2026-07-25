import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import {
  getCategories,
  getProducts,
  type ProductSort,
} from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  }>;
};

const validSortOptions: ProductSort[] = [
  "newest",
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
];

function getSortValue(sort?: string): ProductSort {
  if (
    sort &&
    validSortOptions.includes(sort as ProductSort)
  ) {
    return sort as ProductSort;
  }

  return "newest";
}

function getPageNumber(page?: string): number {
  const parsedPage = Number(page);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    return 1;
  }

  return parsedPage;
}

function buildProductsUrl({
  search,
  category,
  inStock,
  sort,
  page,
}: {
  search: string;
  category: string;
  inStock: boolean;
  sort: ProductSort;
  page: number;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  if (inStock) {
    params.set("inStock", "true");
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const search =
    resolvedSearchParams.search?.trim() ?? "";

  const category =
    resolvedSearchParams.category?.trim() ?? "";

  const inStockOnly =
    resolvedSearchParams.inStock === "true";

  const sort = getSortValue(
    resolvedSearchParams.sort,
  );

  const page = getPageNumber(
    resolvedSearchParams.page,
  );

  const pageSize = 12;

  const [
    {
      products,
      count,
      totalPages,
      error: productsError,
    },
    {
      categories,
      error: categoriesError,
    },
  ] = await Promise.all([
    getProducts({
      search,
      category,
      inStockOnly,
      sort,
      page,
      pageSize,
    }),
    getCategories(),
  ]);

  const firstProductNumber =
    count === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const lastProductNumber = Math.min(
    page * pageSize,
    count,
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-background">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
              Grocery catalog
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Browse all products
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Search groceries, explore categories,
              compare prices, and add products to your
              basket.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <form
            action="/products"
            method="get"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto] lg:items-end">
              <div>
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Search products
                </label>

                <input
                  id="search"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search milk, bread, fruit..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
                >
                  <option value="">
                    All categories
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Sort by
                </label>

                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
                >
                  <option value="newest">
                    Newest
                  </option>
                  <option value="name-asc">
                    Name: A–Z
                  </option>
                  <option value="name-desc">
                    Name: Z–A
                  </option>
                  <option value="price-asc">
                    Price: Low to High
                  </option>
                  <option value="price-desc">
                    Price: High to Low
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Apply filters
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="inStock"
                  value="true"
                  defaultChecked={inStockOnly}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-primary"
                />
                Show in-stock products only
              </label>

              <Link
                href="/products"
                className="font-semibold text-brand-primary transition-colors hover:text-brand-dark"
              >
                Clear all filters
              </Link>
            </div>
          </form>

          {categoriesError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800"
            >
              {categoriesError}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          ) : products.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                No products found
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-slate-600">
                No groceries match your current search
                and filters. Try changing the category,
                search term, or stock option.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                View all products
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Product catalog pagination"
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={buildProductsUrl({
                    search,
                    category,
                    inStock: inStockOnly,
                    sort,
                    page: page - 1,
                  })}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  ← Previous
                </Link>
              )}

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildProductsUrl({
                    search,
                    category,
                    inStock: inStockOnly,
                    sort,
                    page: pageNumber,
                  })}
                  aria-current={
                    pageNumber === page
                      ? "page"
                      : undefined
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
                    inStock: inStockOnly,
                    sort,
                    page: page + 1,
                  })}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}