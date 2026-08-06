import { z } from "zod";

export const AddProductSchema = z.object({
  category_id: z.uuid({ error: "Invalid category" }).optional().nullable().or(z.literal("")),
  name: z.string().min(1, { error: "Product name is required" }).trim(),
  description: z.string().trim().optional().nullable().or(z.literal("")),
  price: z.coerce.number().min(0.01, { error: "Product price must be greater than $0" }),
  unit: z.string().min(1, { error: "Product unit is required (e.g., '1, loaf' or '16 oz')" }).trim(),
  image_url: z.url({ error: "Must be a valid URL" }).trim().optional().nullable().or(z.literal("")),
  stock_quantity: z.int({ error: "Product stock must be a whole number" }).min(0, { error: "Product stock cannot be negative" }),
  is_active: z.boolean().default(true),
})

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

export type AddProductData = z.infer<typeof AddProductSchema>;