"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-primary hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-dark shadow-sm">
          {product.category}
        </span>
      </Link>

      <div className="p-5">
        <p className="text-sm text-slate-500">{product.unit}</p>

        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors hover:text-brand-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xl font-bold text-brand-primary">
            ${product.price.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}