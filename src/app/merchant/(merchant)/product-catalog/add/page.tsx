import AddProductForm from "@/app/ui/merchant/add-product";
import { getCategories } from "@/lib/products";
import type { Metadata } from "next";
import PageTitle from "@/app/ui/account/page-title";

/**
 * Metadata for the "Add Product" page.
 */
export const metadata: Metadata = {
  title: "Add Product",
};

/**
 * The server component for the "Add New Product" page.
 * It fetches the available product categories and passes them to the form.
 */
export default async function NewProductPage() {
  // Fetch all product categories to populate the form's dropdown.
  const { categories, error } = await getCategories();
  return (
    <>
      <PageTitle>Add New Product</PageTitle>
      {/* Render the client-side form, passing the categories as a prop. */}
      <AddProductForm categories={categories} />
    </>
  );
}