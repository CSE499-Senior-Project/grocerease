import Link from "next/link";

import type { ProductSort } from "@/lib/products";

type Category = {
  id: string;
  name: string;
};

type ProductFiltersSidebarProps = {
  categories: Category[];
  search: string;
  category: string;
  sort: ProductSort;
};

function buildCategoryUrl({
  search,
  category,
  sort,
}: {
  search: string;
  category: string;
  sort: ProductSort;
}) {
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

  const queryString = params.toString();

  return queryString
    ? `/products?${queryString}`
    : "/products";
}

export default function ProductFiltersSidebar({
  categories,
  search,
  category,
  sort,
}: ProductFiltersSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <form
        action="/products"
        method="get"
        className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Navigation &amp; Filters
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Find the groceries you need.
          </p>
        </div>

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
            placeholder="Search groceries..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-700">
            Categories
          </legend>

          <nav
            aria-label="Product categories"
            className="mt-3 flex flex-col gap-2"
          >
            <Link
              href={buildCategoryUrl({
                search,
                category: "",
                sort,
              })}
              aria-current={!category ? "page" : undefined}
              className={
                !category
                  ? "rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white"
                  : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-dark"
              }
            >
              All Products
            </Link>

            {categories.map((item) => {
              const isActive = category === item.name;

              return (
                <Link
                  key={item.id}
                  href={buildCategoryUrl({
                    search,
                    category: item.name,
                    sort,
                  })}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white"
                      : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-dark"
                  }
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </fieldset>

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
            <option value="newest">Newest</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {category && (
          <input
            type="hidden"
            name="category"
            value={category}
          />
        )}

        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Apply Filters
        </button>

        <Link
          href="/products"
          className="rounded-xl border border-brand-primary px-5 py-3 text-center font-semibold text-brand-dark transition-colors hover:bg-brand-light"
        >
          Clear All Filters
        </Link>
      </form>
    </aside>
  );
}