import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/merchant-products";
import ProductEditForm from "@/app/ui/merchant/product-edit-form";
import { getCategories } from "@/lib/products";

/**
 * Metadata for the "Edit Product Details" page.
 */
export const metadata: Metadata = {
  title: "Edit Product Details",
};

/**
 * Defines the expected props for the EditProductDetailsPage component,
 * specifically the dynamic `id` parameter from the URL.
 */
type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * The server component for the "Edit Product" page.
 * It fetches the specific product to be edited, along with all available categories,
 * and passes this data to the client-side form.
 * @param {EditProductPageProps} props - The component props, containing the route parameters.
 */
export default async function EditProductDetailsPage({ params }: EditProductPageProps) {
  // Resolve the dynamic 'id' from the URL parameters.
  const { id } = await params;

  // Fetch all products, all categories, and then find the specific product to edit.
  const products = await getProducts();
  const { categories } = await getCategories();
  const productToEdit = products.find((product) => product.id === id);

  // If no product matches the ID, render a 404 page.
  if (!productToEdit) {
    notFound();
  }

  return (
    <>
      {/* Render the form, pre-filled with the product's data and the list of categories. */}
      <ProductEditForm product={productToEdit} categories={categories} />
    </>
  );
}
