import { unstable_rethrow } from "next/navigation";
import type { Product } from "@/types/product";
import { createClient } from "@/utils/supabase/server";

type CategoryRow = {
  id: string;
  name: string;
};

type ProductRow = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  unit: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  categories: CategoryRow | CategoryRow[] | null;
  created_at: string
};

type CategoryDatabaseRow = {
  id: string;
  name: string;
};

export type ProductSort =
  | "newest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export type GetProductsOptions = {
  search?: string;
  category?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type ProductsResult = {
  products: Product[];
  error: string | null;
};

export type ProductCatalogResult = ProductsResult & {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ProductDetailsResult = {
  product: Product | null;
  error: string | null;
};

export type CategoriesResult = {
  categories: CategoryRow[];
  error: string | null;
};

export type HeroCategory = {
  name: string;
  category: string;
  image: string | null;
};

const HERO_CATEGORY_CONFIG = [
  {
    name: "Fresh Produce",
    category: "Fresh Produce",
  },
  {
    name: "Bakery",
    category: "Bakery",
  },
  {
    name: "Dairy",
    category: "Dairy & Eggs",
  },
  {
    name: "Pantry",
    category: "Pantry & Dry Goods",
  },
] as const;

const PRODUCT_COLUMNS = `
  id,
  category_id,
  name,
  description,
  price,
  unit,
  image_url,
  stock_quantity,
  is_active,
  categories (
    id,
    name
  ),
  created_at
`;

const PRODUCT_COLUMNS_WITH_CATEGORY_FILTER = `
  id,
  category_id,
  name,
  description,
  price,
  unit,
  image_url,
  stock_quantity,
  is_active,
  categories!inner (
    id,
    name
  ),
  created_at
`;

function getCategory(
  categories: ProductRow["categories"],
): CategoryRow | null {
  if (!categories) {
    return null;
  }

  if (Array.isArray(categories)) {
    return categories[0] ?? null;
  }

  return categories;
}

function mapProductRow(product: ProductRow): Product {
  const category = getCategory(product.categories);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),

    // Uses the full public Supabase Storage URL.
    image:
      product.image_url ??
      "/images/products/placeholder.webp",

    // Readable category name shown on product cards.
    category: category?.name ?? "Uncategorized",

    // UUID retained for future queries and filters.
    categoryId:
      product.category_id ??
      category?.id ??
      null,

    unit: product.unit,
    stockQuantity: product.stock_quantity,
    inStock: product.stock_quantity > 0,
    createdAt: product.created_at
  };
}

function applySort<
  T extends {
    order: (
      column: string,
      options?: { ascending?: boolean },
    ) => T;
  },
>(query: T, sort: ProductSort): T {
  switch (sort) {
    case "name-asc":
      return query.order("name", { ascending: true });

    case "name-desc":
      return query.order("name", { ascending: false });

    case "price-asc":
      return query.order("price", { ascending: true });

    case "price-desc":
      return query.order("price", { ascending: false });

    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
}

/**
 * Landing-page products.
 *
 * This remains separate from the complete product catalog so the homepage
 * can continue showing only a limited number of featured products.
 */
export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductsResult> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        "Unable to load featured products:",
        error.message,
      );

      return {
        products: [],
        error: "We could not load products at this time.",
      };
    }

    const rows = (data ?? []) as unknown as ProductRow[];

    return {
      products: rows.map(mapProductRow),
      error: null,
    };
  } catch (error: any) {
    if (error?.message?.includes('Dynamic server usage')) {
      throw error;
    }

    console.error(
      "Unexpected featured-product loading error:",
      error,
    );

    return {
      products: [],
      error:
        "An unexpected error occurred while loading products.",
    };
  }
}

/**
 * Complete product catalog.
 *
 * Supports:
 * - search by product name
 * - category filtering
 * - automatically excludes out-of-stock products
 * - sorting
 * - pagination
 */
export async function getProducts(
  options: GetProductsOptions = {},
): Promise<ProductCatalogResult> {
  const {
    search = "",
    category = "",
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = options;

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(
    48,
    Math.max(1, pageSize),
  );

  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  try {
    const supabase = await createClient();

    const selectedColumns = category
      ? PRODUCT_COLUMNS_WITH_CATEGORY_FILTER
      : PRODUCT_COLUMNS;

    let query = supabase
      .from("products")
      .select(selectedColumns, {
        count: "exact",
      })
      .eq("is_active", true)
      .gt("stock_quantity", 0);

    const trimmedSearch = search.trim();
    const trimmedCategory = category.trim();

    if (trimmedSearch) {
      query = query.ilike(
        "name",
        `%${trimmedSearch}%`,
      );
    }

    if (trimmedCategory) {
      query = query.eq(
        "categories.name",
        trimmedCategory,
      );
    }

    query = applySort(query, sort);

    const { data, error, count } = await query.range(
      from,
      to,
    );

    if (error) {
      console.error(
        "Unable to load product catalog:",
        error.message,
      );

      return {
        products: [],
        count: 0,
        page: safePage,
        pageSize: safePageSize,
        totalPages: 0,
        error:
          "We could not load the product catalog at this time.",
      };
    }

    const rows = (data ?? []) as unknown as ProductRow[];
    const totalCount = count ?? 0;

    return {
      products: rows.map(mapProductRow),
      count: totalCount,
      page: safePage,
      pageSize: safePageSize,
      totalPages:
        totalCount === 0
          ? 0
          : Math.ceil(totalCount / safePageSize),
      error: null,
    };
  } catch (error) {
    console.error(
      "Unexpected product-catalog loading error:",
      error,
    );

    return {
      products: [],
      count: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 0,
      error:
        "An unexpected error occurred while loading the product catalog.",
    };
  }
}

/**
 * Single product used by /products/[id].
 */
export async function getProductById(
  productId: string,
): Promise<ProductDetailsResult> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error(
        "Unable to load product details:",
        error.message,
      );

      return {
        product: null,
        error:
          "We could not load this product at this time.",
      };
    }

    if (!data) {
      return {
        product: null,
        error: null,
      };
    }

    return {
      product: mapProductRow(
        data as unknown as ProductRow,
      ),
      error: null,
    };
  } catch (error) {
    console.error(
      "Unexpected product-details loading error:",
      error,
    );

    return {
      product: null,
      error:
        "An unexpected error occurred while loading this product.",
    };
  }
}

/**
 * Category list used by the catalog sidebar and filter controls.
 */
export async function getCategories(): Promise<CategoriesResult> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "Unable to load categories:",
        error.message,
      );

      return {
        categories: [],
        error:
          "We could not load product categories.",
      };
    }

    return {
      categories:
        (data ?? []) as CategoryDatabaseRow[],
      error: null,
    };
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE' || error?.message?.includes('Dynamic server usage')) {
      throw error;
    }

    console.error(
      "Unexpected category loading error:",
      error,
    );

    return {
      categories: [],
      error:
        "An unexpected error occurred while loading categories.",
    };
  }
}

/**
 * Returns one representative Supabase product image for each hero category.
 */
export async function getHeroCategories(): Promise<HeroCategory[]> {
  const fallbackCategories = HERO_CATEGORY_CONFIG.map((category) => ({
    ...category,
    image: null,
  }));

  try {
    const supabase = await createClient();

    const categoryNames = HERO_CATEGORY_CONFIG.map(
      (category) => category.category,
    );

    const { data, error } = await supabase
      .from("products")
      .select(`
        image_url,
        categories!inner (
          id,
          name
        )
      `)
      .eq("is_active", true)
      .gt("stock_quantity", 0)
      .not("image_url", "is", null)
      .in("categories.name", categoryNames)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Unable to load hero category images:",
        error.message,
      );

      return fallbackCategories;
    }

    const categoryImages = new Map<string, string>();

    const rows = (data ?? []) as unknown as Array<
      Pick<ProductRow, "image_url" | "categories">
    >;

    for (const row of rows) {
      const category = getCategory(row.categories);

      if (
        category &&
        row.image_url &&
        !categoryImages.has(category.name)
      ) {
        categoryImages.set(category.name, row.image_url);
      }
    }

    return HERO_CATEGORY_CONFIG.map((category) => ({
      ...category,
      image: categoryImages.get(category.category) ?? null,
    }));
  } catch (error) {
    unstable_rethrow(error);

    console.error(
      "Unexpected hero category loading error:",
      error,
    );

    return fallbackCategories;
  }
}