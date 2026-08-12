"use client";

import type { Product } from "@/types/product";
import { createClient } from "@/utils/supabase/client";

export interface SyncedCartItem extends Product {
  quantity: number;
}

type BrowserSupabaseClient = ReturnType<
  typeof createClient
>;

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
  created_at: string;
  categories: CategoryRow | CategoryRow[] | null;
};

type CartItemRow = {
  quantity: number;
  products: ProductRow | ProductRow[] | null;
};

type ExistingCartItemRow = {
  id: string;
  product_id: string;
  quantity: number;
};

export type RemoteCartResult = {
  cartId: string;
  items: SyncedCartItem[];
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * A helper to safely extract a single related record from a Supabase query result,
 * which might be null, a single object, or an array of objects.
 * @param {T | T[] | null} relation - The Supabase relation data.
 * @returns {T | null} The single related record or null.
 */
function getSingleRelation<T>(
  relation: T | T[] | null,
): T | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

/**
 * Maps a `cart_items` row from Supabase to the application's `SyncedCartItem` type.
 * It handles data validation, transformation (e.g., price to number), and ensures
 * that only active, in-stock products are included in the cart.
 * @param {CartItemRow} row - The raw cart item data from Supabase.
 * @returns {SyncedCartItem | null} The transformed cart item or null if invalid.
 */
function mapCartItemRow(
  row: CartItemRow,
): SyncedCartItem | null {
  const product = getSingleRelation(row.products);

  if (
    !product ||
    !product.is_active ||
    product.stock_quantity <= 0
  ) {
    return null;
  }

  const category = getSingleRelation(
    product.categories,
  );

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image_url,
    category: category?.name ?? "Uncategorized",
    categoryId:
      product.category_id ?? category?.id ?? null,
    unit: product.unit,
    stockQuantity: product.stock_quantity,
    inStock: product.stock_quantity > 0,
    createdAt: product.created_at,
    quantity: Math.min(
      Math.max(1, row.quantity),
      product.stock_quantity,
    ),
  };
}

/**
 * Ensures a cart exists for the given user in the Supabase `carts` table.
 * It uses an `upsert` operation with `onConflict` to either find the existing cart
 * or create a new one in a single, atomic database call.
 * @param {BrowserSupabaseClient} supabase - The Supabase client instance.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} A promise that resolves to the user's cart ID.
 */
async function getOrCreateCartId(
  supabase: BrowserSupabaseClient,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("carts")
    .upsert(
      {
        user_id: userId,
      },
      {
        onConflict: "user_id",
      },
    )
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "Unable to create the user cart.",
    );
  }

  return data.id as string;
}

/**
 * Loads the user's cart from Supabase.
 * It first ensures a cart ID exists, then fetches all associated cart items and their
 * related product data.
 * @param {BrowserSupabaseClient} supabase - The Supabase client instance.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<RemoteCartResult>} A promise resolving to the cart ID and its items.
 */
export async function loadRemoteCart(
  supabase: BrowserSupabaseClient,
  userId: string,
): Promise<RemoteCartResult> {
  const cartId = await getOrCreateCartId(
    supabase,
    userId,
  );

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      quantity,
      products!inner (
        id,
        category_id,
        name,
        description,
        price,
        unit,
        image_url,
        stock_quantity,
        is_active,
        created_at,
        categories (
          id,
          name
        )
      )
    `)
    .eq("cart_id", cartId);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as unknown as CartItemRow[];

  return {
    cartId,
    items: rows
      .map(mapCartItemRow)
      .filter(
        (item): item is SyncedCartItem =>
          item !== null,
      ),
  };
}

/**
 * Merges two arrays of cart items into a single array.
 * It handles combining quantities for duplicate products based on the specified mode.
 * 'max' mode takes the highest quantity, while 'add' mode sums them.
 * @param {SyncedCartItem[]} currentItems - The base array of items.
 * @param {SyncedCartItem[]} incomingItems - The array of items to merge in.
 * @param {"add" | "max"} mode - The strategy for merging quantities.
 * @returns {SyncedCartItem[]} The new, merged array of cart items.
 */
export function mergeCartItems(
  currentItems: SyncedCartItem[],
  incomingItems: SyncedCartItem[],
  mode: "add" | "max" = "max",
): SyncedCartItem[] {
  const mergedItems = new Map<
    string,
    SyncedCartItem
  >();

  for (const item of currentItems) {
    mergedItems.set(item.id, { ...item });
  }

  for (const incomingItem of incomingItems) {
    const existingItem = mergedItems.get(
      incomingItem.id,
    );

    if (!existingItem) {
      mergedItems.set(incomingItem.id, {
        ...incomingItem,
      });
      continue;
    }

    const mergedQuantity =
      mode === "add"
        ? existingItem.quantity +
          incomingItem.quantity
        : Math.max(
            existingItem.quantity,
            incomingItem.quantity,
          );

    mergedItems.set(incomingItem.id, {
      ...existingItem,
      quantity: Math.min(
        mergedQuantity,
        Math.max(existingItem.stockQuantity, 1),
      ),
    });
  }

  return Array.from(mergedItems.values());
}

/**
 * Synchronizes the local cart state with the remote Supabase cart.
 * This function performs a three-way merge:
 * 1. It identifies items to add (present locally, not remotely).
 * 2. It identifies items to update (present in both, but with different quantities).
 * 3. It identifies items to delete (present remotely, not locally).
 * This ensures the remote cart perfectly mirrors the local state.
 * @param {BrowserSupabaseClient} supabase - The Supabase client instance.
 * @param {string} cartId - The ID of the cart to synchronize.
 * @param {SyncedCartItem[]} cartItems - The current local array of cart items.
 */
export async function syncRemoteCart(
  supabase: BrowserSupabaseClient,
  cartId: string,
  cartItems: SyncedCartItem[],
): Promise<void> {
  const targetItems = new Map(
    cartItems
      .filter(
        (item) =>
          item.inStock &&
          item.quantity > 0 &&
          UUID_PATTERN.test(item.id),
      )
      .map((item) => [
        item.id,
        {
          productId: item.id,
          quantity: Math.min(
            item.quantity,
            Math.max(item.stockQuantity, 1),
          ),
        },
      ]),
  );

  const { data, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("cart_id", cartId);

  if (error) {
    throw new Error(error.message);
  }

  const existingRows = (
    data ?? []
  ) as ExistingCartItemRow[];

  const seenProductIds = new Set<string>();
  const itemIdsToDelete: string[] = [];

  for (const existingRow of existingRows) {
    if (seenProductIds.has(existingRow.product_id)) {
      itemIdsToDelete.push(existingRow.id);
      continue;
    }

    seenProductIds.add(existingRow.product_id);

    const targetItem = targetItems.get(
      existingRow.product_id,
    );

    if (!targetItem) {
      itemIdsToDelete.push(existingRow.id);
      continue;
    }

    if (
      existingRow.quantity !== targetItem.quantity
    ) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: targetItem.quantity,
        })
        .eq("id", existingRow.id)
        .eq("cart_id", cartId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    targetItems.delete(existingRow.product_id);
  }

  if (itemIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .in("id", itemIdsToDelete);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  const itemsToInsert = Array.from(
    targetItems.values(),
  ).map((item) => ({
    cart_id: cartId,
    product_id: item.productId,
    quantity: item.quantity,
  }));

  if (itemsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert(itemsToInsert);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { error: cartUpdateError } = await supabase
    .from("carts")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartId);

  if (cartUpdateError) {
    throw new Error(cartUpdateError.message);
  }
}