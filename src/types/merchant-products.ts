export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export type Category = {
  id: string;
  name: string;
}

export type MerchantProduct = Product & {
  categories: Category | null;
};