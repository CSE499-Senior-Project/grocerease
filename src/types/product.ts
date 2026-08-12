/**
 * Defines the structure of a product object as used throughout the client-side application.
 * This interface represents a transformed version of the raw product data from the database,
 * tailored for display in components like product cards and detail pages.
 */
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