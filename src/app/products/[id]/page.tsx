import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { getProductById } from "@/lib/products";

/**
 * Defines the expected props for the ProductDetailsPage component,
 * specifically the dynamic `id` parameter from the URL.
 */
type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Dynamically generates metadata for the product details page.
 * This function is used by Next.js to set the page's title and description for SEO.
 * @param {ProductDetailsPageProps} props - The component props, containing route parameters.
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProductById(id);

  // If the product is not found, return a generic "Not Found" title.
  if (!product) {
    return {
      title: "Product Not Found | GrocerEase",
      description:
        "The requested grocery product could not be found.",
    };
  }

  // If the product is found, use its name and description for the page metadata.
  return {
    title: `${product.name} | GrocerEase`,
    description:
      product.description ||
      `View details and pricing for ${product.name}.`,
  };
}

/**
 * The server component for displaying the details of a single product.
 * It fetches the product by its ID from the URL parameters.
 * @param {ProductDetailsPageProps} props - The component props.
 */
export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  // Resolve the dynamic 'id' from the URL parameters.
  const { id } = await params;

  // Fetch the specific product by its ID.
  const { product, error } =
    await getProductById(id);

  // If there was an error fetching the product, display a user-friendly error message.
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

  // If the product is not found (but no error occurred), trigger the not-found boundary.
  if (!product) {
    notFound();
  }

  // If the product is found successfully, render the client component to display its details.
  return (
    <ProductDetails product={product} />
  );
}