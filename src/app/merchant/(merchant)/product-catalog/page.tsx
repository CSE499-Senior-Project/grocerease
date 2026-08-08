import type { Metadata } from "next";
import PageTitle from "@/app/ui/account/page-title";
import OrderCard from "@/app/ui/merchant/order-card";
import { getProducts } from "@/lib/merchant-products";
import Link from "next/link";
import ProductTable from "@/app/ui/merchant/product-table";

export const metadata: Metadata = {
  title: "Product Catalog",
};

export default async function ProductCatalogPage() {
  const products = await getProducts();

  return (
    <>
      <PageTitle
        action={
          <Link
            href="/merchant/product-catalog/add"
            className="shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
          >
            Add Product
          </Link>
        }
      >
        Products
      </PageTitle>

      {products.length === 0 ? (
        <OrderCard className="p-6 text-center">
          <p className="text-slate-600">
            Your product catalog is currently empty. Click &apos;Add Product&apos; to start building your inventory.
          </p>
        </OrderCard>
      ) : (
        <div className="space-y-8">
          <ProductTable 
            products={products}
          />
        </div>
      )}
    </>
  );
}
