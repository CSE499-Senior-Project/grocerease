import { z } from "zod";

export const CheckoutSchema = z.object({
  user_id: z.uuid({ message: "Invalid user ID." }).optional(),
  subtotal: z.number().min(0, { message: "Subtotal cannot be negative." }),
  service_fee: z.number().min(0, { message: "Service fee cannot be negative." }),
  total_amount: z.number().min(0, { message: "Total amount cannot be negative." }),
  tax_amount: z.number().min(0, { message: "Tax amount cannot be negative." }),
  delivery_time_slot: z.iso.datetime({ message: "Invalid delivery time slot."}).refine((val) => new Date(val) > new Date(), { message: "Delivery time must be in the future." }),
  delivery_address: z.string().trim().min(1, { message: "Delivery address is required" }),
  items: z.array(z.object({
    product_id: z.uuid({ message: "Invalid product ID." }).nullable(),
    quantity: z.int().min(0, { message: ""}),
    price_at_time: z.number().min(0, { message: "Price amount cannot be negative." })
  }))
});


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

export type CheckoutData = z.infer<typeof CheckoutSchema>;