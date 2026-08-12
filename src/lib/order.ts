import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { MerchantOrder, CustomerOrder } from '@/types/order';
import { createClient } from '@/utils/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fetches all orders for the merchant dashboard.
 * This function is wrapped in `cache` to memoize the result per request.
 * It retrieves comprehensive order details, including customer profile information
 * and the specific items within each order.
 */
export const getOrders = cache(async (): Promise<MerchantOrder[]> => {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    *, 
    profiles (
      id,
      email,
      first_name,
      last_name,
      phone_number
    ),
    order_items (
      id,
      quantity,
      price_at_time,
      products (
        id,
        name,
        image_url,
        unit
      )
    )
  `)
  // in the future we could add a `.eq()` || `.in()` || `.neq()` to display only the active orders.
  .order("created_at", { ascending: false});

  if (error) console.error("Supabase Orders Error:", error);

  return orders ?? [];
})

/**
 * Fetches all orders belonging to the currently authenticated customer.
 * This function is wrapped in `cache` to memoize the result per request.
 * It ensures that a user is signed in and only retrieves orders associated with their user ID.
 * @returns {Promise<CustomerOrder[]>} A promise that resolves to an array of the customer's orders.
 */
export const getCustomerOrders = cache(async (): Promise<CustomerOrder[]> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          image_url,
          unit
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<CustomerOrder[]>();

  if (error) {
    throw new Error(error.message);
  }

  return orders ?? [];
})

/**
 * Fetches a single order by its ID for the currently authenticated customer.
 * This function is wrapped in `cache` to memoize the result per request.
 * It validates the order ID format and ensures the fetched order belongs to the current user.
 * @param {string} orderId - The UUID of the order to fetch.
 * @returns {Promise<CustomerOrder | null>} A promise that resolves to the order object or null if not found.
 */
export const getCustomerOrderById = cache(async (orderId: string): Promise<CustomerOrder | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  if (!UUID_REGEX.test(orderId)) {
    return null;
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          image_url,
          unit
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('id', orderId)
    .returns<CustomerOrder[]>()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return order;
})