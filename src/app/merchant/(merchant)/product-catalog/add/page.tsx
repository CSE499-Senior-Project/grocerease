import AddProductForm from "@/app/ui/merchant/add-product";
import { getCategories } from "@/lib/products";
import type { Metadata } from "next";
import PageTitle from "@/app/ui/account/page-title";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function NewProductPage() {
  const { categories, error } = await getCategories();
  return (
    <>
      <PageTitle>Add New Product</PageTitle>
      <AddProductForm categories={categories} />
    </>
  );
}