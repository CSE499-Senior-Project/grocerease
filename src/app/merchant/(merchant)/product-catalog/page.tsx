import type { Metadata } from "next";
import PageTitle from "@/app/ui/account/page-title";
import OrderCard from "@/app/ui/merchant/order-card";
import { getProducts } from "@/lib/merchant-products";
import Link from "next/link";
import ProductTable from "@/app/ui/merchant/product-table";

/**
 * Metadata for the Product Catalog page.
 */
export const metadata: Metadata = {
  title: "Product Catalog",
};

/**
 * The server component for the merchant's "Product Catalog" page.
 * It fetches all products and displays them in a table.
 */
export default async function ProductCatalogPage() {
  // Fetch all products from the database.
  const products = await getProducts();

  return (
    <>
      <PageTitle
        // The action slot in the title contains a link to the "Add Product" page.
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

      {/* Conditionally render a message if the catalog is empty. */}
      {products.length === 0 ? (
        <OrderCard className="p-6 text-center">
          <p className="text-slate-600">
            Your product catalog is currently empty. Click &apos;Add Product&apos; to start building your inventory.
          </p>
        </OrderCard>
      ) : (
        // If products exist, render them in the ProductTable component.
        <div className="space-y-8">
          <ProductTable 
            products={products}
          />
        </div>
      )}
    </>
  );
}
