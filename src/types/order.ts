export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "shopping" | "out for delivery" | "delivered";
  subtotal: number;
  service_fee: number;
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
};

export type MerchantOrder = Order & {
  profiles: OrderProfile | null;
  order_items: OrderItemWithProduct[];
};