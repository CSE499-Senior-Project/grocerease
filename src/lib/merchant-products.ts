import { cache } from "react";
import type { MerchantProduct } from "@/types/merchant-products";
import { createClient } from "@/utils/supabase/server";

/**
 * Fetches all products for the merchant view, including their associated category data.
 * This function is wrapped in `cache` to memoize the result on a per-request basis,
 * preventing redundant database calls if this function is invoked multiple times
 * during a single server render.
 */
export const getProducts = cache(async (): Promise<MerchantProduct[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
  .from('products')
  .select(`
    *,
    categories (
      id, 
      name
    )
  `)
  // Temporarily add a condition that will never be true to test the condition products.length === 0 ?
  // .eq("name", "PRODUCT_INEXISTENT")
  .order("name", { ascending: true});

  if (error) console.error("Supabase Products Error:", error);

  return products ?? [];
})
