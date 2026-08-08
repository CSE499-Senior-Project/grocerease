export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  categoryId: string | null;
  unit: string;
  stockQuantity: number;
  inStock: boolean;
  createdAt: string;
}