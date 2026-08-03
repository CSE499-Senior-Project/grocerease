import { cache } from 'react';
import type { MerchantOrder } from '@/types/order';
import { createClient } from '@/utils/supabase/server';

export const getOrders = cache(async (): Promise<MerchantOrder[]> => {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *, 
      profiles (
        id,
        email,
        first_name,
        last_name
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
    .order("created_at", { ascending: false})
  return orders ?? [];
})