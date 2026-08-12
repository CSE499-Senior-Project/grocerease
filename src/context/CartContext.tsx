"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  loadRemoteCart,
  mergeCartItems,
  syncRemoteCart,
} from "@/lib/cart";
import type { Product } from "@/types/product";
import { createClient } from "@/utils/supabase/client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<
  CartContextValue | undefined
>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialUserId?: string | null;
}

const GUEST_CART_STORAGE_KEY =
  "grocerease:cart:guest";

function getUserCartStorageKey(userId: string) {
  return `grocerease:cart:${userId}`;
}

/**
 * A type guard to validate that an item read from storage has the expected structure of a CartItem.
 * This prevents runtime errors from malformed data in localStorage.
 * @param item - The item to check.
 * @returns {boolean} - True if the item is a valid CartItem.
 */
function isStoredCartItem(item: unknown): item is CartItem {
  if (
    typeof item !== "object" ||
    item === null
  ) {
    return false;
  }

  return (
    "id" in item &&
    typeof item.id === "string" &&
    "name" in item &&
    typeof item.name === "string" &&
    "price" in item &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    "quantity" in item &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

/**
 * Reads and parses the cart items from localStorage for a given storage key.
 * @param {string} storageKey - The key to read from localStorage.
 * @returns {CartItem[]} - An array of cart items, or an empty array if not found or invalid.
 */
function readStoredCart(
  storageKey: string,
): CartItem[] {
  try {
    const storedCart =
      window.localStorage.getItem(storageKey);

    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(isStoredCartItem);
  } catch (error) {
    console.error(
      "Unable to restore the saved cart:",
      error,
    );

    return [];
  }
}

/**
 * Writes the current cart items to localStorage.
 * @param {string} storageKey - The key to write to in localStorage.
 * @param {CartItem[]} cartItems - The array of cart items to store.
 */
function writeStoredCart(
  storageKey: string,
  cartItems: CartItem[],
) {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(cartItems),
    );
  } catch (error) {
    console.error(
      "Unable to save the cart locally:",
      error,
    );
  }
}

/**
 * Provides a cart context to the application. It manages the shopping cart's state,
 * including adding, removing, and updating items.
 *
 * Core functionalities:
 * - Initializes cart from localStorage for guests or merges local and remote (Supabase) carts for signed-in users.
 * - Persists cart changes to localStorage.
 * - Debounces and queues synchronization of the cart with the Supabase backend for authenticated users.
 */
export function CartProvider({
  children,
  initialUserId = null,
}: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(
    [],
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeStorageKey, setActiveStorageKey] =
    useState(GUEST_CART_STORAGE_KEY);
  const [remoteCartId, setRemoteCartId] = useState<
    string | null
  >(null);

  const syncQueueRef = useRef<Promise<void>>(
    Promise.resolve(),
  );

  /**
   * This effect handles the initial loading and hydration of the cart.
   * - For guest users, it loads the cart from guest-specific localStorage.
   * - For authenticated users, it performs a multi-step merge:
   *   1. Fetches the user's cart from Supabase.
   *   2. Merges the remote cart with any locally cached user cart.
   *   3. Merges the result with any items from the guest cart (from before sign-in).
   *   4. Synchronizes the final merged cart back to Supabase and clears the guest cart.
   */
  useEffect(() => {
    let isCancelled = false;

    const initializationTimer = window.setTimeout(() => {
      async function initializeCart() {
        setIsHydrated(false);

        const guestItems = readStoredCart(
          GUEST_CART_STORAGE_KEY,
        );

        if (!initialUserId) {
          if (isCancelled) {
            return;
          }

          setCartItems(guestItems);
          setActiveStorageKey(
            GUEST_CART_STORAGE_KEY,
          );
          setRemoteCartId(null);
          setIsHydrated(true);
          return;
        }

        const userStorageKey =
          getUserCartStorageKey(initialUserId);
        const cachedUserItems =
          readStoredCart(userStorageKey);
        const supabase = createClient();

        try {
          const remoteCart = await loadRemoteCart(
            supabase,
            initialUserId,
          );

          const remoteAndCachedItems = mergeCartItems(
            remoteCart.items,
            cachedUserItems,
            "max",
          );

          const mergedItems = mergeCartItems(
            remoteAndCachedItems,
            guestItems,
            "add",
          );

          await syncRemoteCart(
            supabase,
            remoteCart.cartId,
            mergedItems,
          );

          if (isCancelled) {
            return;
          }

          window.localStorage.removeItem(
            GUEST_CART_STORAGE_KEY,
          );

          writeStoredCart(
            userStorageKey,
            mergedItems,
          );

          setCartItems(mergedItems);
          setActiveStorageKey(userStorageKey);
          setRemoteCartId(remoteCart.cartId);
          setIsHydrated(true);
        } catch (error) {
          console.error(
            "Unable to synchronize the cart with Supabase:",
            error,
          );

          if (isCancelled) {
            return;
          }

          /*
           * If synchronization fails, retain a safe local
           * fallback. Guest items remain under the guest key
           * so synchronization can be retried after reload.
           */
          if (guestItems.length > 0) {
            setCartItems(guestItems);
            setActiveStorageKey(
              GUEST_CART_STORAGE_KEY,
            );
          } else {
            setCartItems(cachedUserItems);
            setActiveStorageKey(userStorageKey);
          }

          setRemoteCartId(null);
          setIsHydrated(true);
        }
      }

      void initializeCart();
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(initializationTimer);
    };
  }, [initialUserId]);

  /**
   * This effect is responsible for persisting cart changes.
   * - It writes the current `cartItems` to the active localStorage key whenever they change.
   * - For authenticated users, it schedules a debounced synchronization to the Supabase backend.
   * - A promise queue (`syncQueueRef`) is used to ensure that multiple rapid updates
   *   are sent sequentially, preventing race conditions.
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeStoredCart(
      activeStorageKey,
      cartItems,
    );

    if (!initialUserId || !remoteCartId) {
      return;
    }

    const cartSnapshot = cartItems.map((item) => ({
      ...item,
    }));

    const synchronizationTimer = window.setTimeout(
      () => {
        syncQueueRef.current = syncQueueRef.current
          .then(async () => {
            const supabase = createClient();

            await syncRemoteCart(
              supabase,
              remoteCartId,
              cartSnapshot,
            );
          })
          .catch((error: unknown) => {
            console.error(
              "Unable to update the Supabase cart:",
              error,
            );
          });
      },
      350,
    );

    return () => {
      window.clearTimeout(synchronizationTimer);
    };
  }, [
    activeStorageKey,
    cartItems,
    initialUserId,
    isHydrated,
    remoteCartId,
  ]);

  /**
   * Adds a product to the cart. If the product is already in the cart,
   * its quantity is incremented.
   * @param {Product} product - The product to add.
   */
  function addToCart(product: Product) {
    if (!product.inStock) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  Math.max(item.stockQuantity, 1),
                ),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId: string) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId,
      ),
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                quantity,
                Math.max(item.stockQuantity, 1),
              ),
            }
          : item,
      ),
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (totalQuantity, item) =>
          totalQuantity + item.quantity,
        0,
      ),
    [cartItems],
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (totalPrice, item) =>
          totalPrice + item.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const value: CartContextValue = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider.",
    );
  }

  return context;
}