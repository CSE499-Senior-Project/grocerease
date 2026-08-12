"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

/**
 * Renders a product card for display in catalog grids.
 * This component shows key product information like image, name, and price.
 * It provides links to the product details page and the product's category.
 * An "Add to Cart" button allows users to add the product directly to their cart.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const categoryName = product.category || "Uncategorized";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        aria-label={`View details for ${product.name}`}
        className="relative block aspect-square cursor-pointer overflow-hidden bg-slate-100"
      >
        <Image
          src={product.image ?? "/images/products/placeholder.webp"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <Link
        href={`/products?category=${encodeURIComponent(categoryName)}`}
        aria-label={`Browse ${categoryName} products`}
        className="absolute left-4 top-4 z-20 inline-flex cursor-pointer items-center rounded-full border border-transparent bg-white/95 px-3 py-1 text-xs font-semibold text-brand-dark shadow-sm transition-colors duration-200 hover:border-brand-primary hover:bg-brand-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        {categoryName}
      </Link>

      <div className="p-5">
        <p className="text-sm text-slate-500">{product.unit}</p>

        <Link
          href={`/products/${product.id}`}
          className="cursor-pointer"
        >
          <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors hover:text-brand-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xl font-bold text-brand-primary">
            ${product.price.toFixed(2)}
          </p>

          {/* The "Add to Cart" button is disabled if the product is out of stock. */}
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className="cursor-pointer rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}