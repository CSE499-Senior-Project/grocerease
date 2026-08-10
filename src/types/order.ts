import { z } from "zod";

export const CheckoutSchema = z.object({
  user_id: z.uuid(),
  subtotal: z.number(),
  service_fee: z.number(),
  total_amount: z.number(),
  delivery_time_slot: z.string(),
  delivery_address: z.string(),
})


export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "shopping" | "out for delivery" | "delivered";
  subtotal: number;
  service_fee: number;
  tax_amount: number;
  total_amount: number;
  delivery_time_slot: string;
  delivery_address: string;
  created_at: string; 
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_at_time: number;
};

export type OrderItemWithProduct = {
  id: string;
  quantity: number;
  price_at_time: number;
  products: {
    id: string;
    name: string;
    image_url: string | null;
    unit: string;
  } | null;
};

export type OrderProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
};

export type MerchantOrder = Order & {
  profiles: OrderProfile | null;
  order_items: OrderItemWithProduct[];
};

export type CustomerOrder = Order & {
  order_items: OrderItemWithProduct[];
};