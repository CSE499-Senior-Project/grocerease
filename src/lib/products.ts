import { cookies } from "next/headers";

import type { Product } from "@/types/product";
import { createClient } from "@/utils/supabase/server";

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
};

export type ProductsResult = {
  products: Product[];
  error: string | null;
};

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductsResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("products")
      .select(
        `
          id,
          category_id,
          name,
          description,
          price,
          unit,
          image_url,
          stock_quantity,
          is_active
        `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Unable to load featured products:", error.message);

      return {
        products: [],
        error: "We could not load products at this time.",
      };
    }

    const products = (data as ProductRow[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price),
      image:
        product.image_url ??
        "/images/products/placeholder.webp",
      categoryId: product.category_id,
      unit: product.unit,
      stockQuantity: product.stock_quantity,
      inStock: product.stock_quantity > 0,
    }));

    return {
      products,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected product loading error:", error);

    return {
      products: [],
      error: "An unexpected error occurred while loading products.",
    };
  }
}