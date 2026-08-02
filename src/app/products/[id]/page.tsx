import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { getProductById } from "@/lib/products";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | GrocerEase",
      description:
        "The requested grocery product could not be found.",
    };
  }

  return {
    title: `${product.name} | GrocerEase`,
    description:
      product.description ||
      `View details and pricing for ${product.name}.`,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const { product, error } =
    await getProductById(id);

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12">
          <h1 className="text-3xl font-bold text-red-800">
            Unable to load product
          </h1>

          <p className="mt-4 text-red-700">
            {error}
          </p>

          <p className="mt-2 text-sm text-red-600">
            Please try again or return to the
            product catalog.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-800"
          >
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductDetails product={product} />
  );
}