import { z } from "zod";

/**
 * Zod schema for validating new product data.
 * It enforces types and constraints for all fields required to create a product.
 * Custom error messages are provided for better user feedback.
 */
export const ProductSchema = z.object({
  category_id: z.uuid({ error: "Invalid category" }).optional().nullable().or(z.literal("")),
  name: z.string().min(1, { error: "Product name is required" }).trim(),
  description: z.string().trim().optional().nullable().or(z.literal("")),
  price: z.number({ error: "Product price is required"}).min(0.01, { error: "Product price must be greater than $0" }),
  unit: z.string().min(1, { error: "Product unit is required (e.g., '1, loaf' or '16 oz')" }).trim(),
  image_url: z.url({ error: "Must be a valid URL" }).trim().optional().nullable().or(z.literal("")),
  stock_quantity: z.number({ error: "Product stock is required" }).min(0, { error: "Product stock cannot be negative" }),
  is_active: z.boolean(),
});

/**
 * Zod schema for validating product edits.
 * It extends the base `ProductSchema` to include the product `id`,
 * which is required for update operations.
 */
export const EditProductSchema = ProductSchema.extend({
  id: z.uuid()
});

/**
 * The base TypeScript type for a product, representing its structure in the database.
 */
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
};

/**
 * The TypeScript type for a product category.
 */
export type Category = {
  id: string;
  name: string;
};

/**
 * The TypeScript type for a product as viewed by a merchant.
 * It extends the base `Product` type to include the nested category object.
 */
export type MerchantProduct = Product & {
  categories: Category | null;
};

/**
 * The TypeScript type for data submitted through the "add product" form.
 * Inferred from the `ProductSchema`.
 */
export type ProductData = z.infer<typeof ProductSchema>;
/**
 * The TypeScript type for data submitted through the "edit product" form.
 * Inferred from the `EditProductSchema`.
 */
export type EditProductData = z.infer<typeof EditProductSchema>;