export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryId: string | null;
  unit: string;
  stockQuantity: number;
  inStock: boolean;
}