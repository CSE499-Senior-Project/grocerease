import ProductCatalogResults from "@/components/products/ProductCatalogResults";
import ProductFiltersSidebar from "@/components/products/ProductFiltersSidebar";
import ProductPagination from "@/components/products/ProductPagination";
import {
  getCategories,
  getProducts,
  type ProductSort,
} from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const search =
    resolvedSearchParams.search?.trim() ?? "";

  const category =
    resolvedSearchParams.category?.trim() ?? "";

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
      <section className="w-full border-b border-slate-200 bg-white">
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

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:px-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <ProductFiltersSidebar
          categories={categories}
          search={search}
          category={category}
          sort={sort}
        />

        <div className="min-w-0">
          {categoriesError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800"
            >
              {categoriesError}
            </div>
          )}

          <ProductCatalogResults
            products={products}
            count={count}
            firstProductNumber={firstProductNumber}
            lastProductNumber={lastProductNumber}
            category={category}
            productsError={productsError}
          />

          <ProductPagination
            search={search}
            category={category}
            sort={sort}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}