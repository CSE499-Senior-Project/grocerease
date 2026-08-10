import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/merchant-products";
import ProductEditForm from "@/app/ui/merchant/product-edit-form";
import { getCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Edit Product Details",
};

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductDetailsPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const products = await getProducts();
  const { categories } = await getCategories();
  const productToEdit = products.find((product) => product.id === id);

  if (!productToEdit) {
    notFound();
  }

  return (
    <>
      <ProductEditForm product={productToEdit} categories={categories} />
    </>
  );
}
