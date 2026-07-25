"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  const categoryName =
    product.category || "Uncategorized";

  const productImage =
    product.image ??
    "/images/products/placeholder.webp";

  function decreaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    );
  }

  function increaseQuantity() {
    if (!product.inStock) {
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(
        product.stockQuantity,
        currentQuantity + 1,
      ),
    );
  }

  function handleAddToCart() {
    if (!product.inStock) {
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    setAddedMessage(
      `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`,
    );

    window.setTimeout(() => {
      setAddedMessage("");
    }, 3000);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link
          href="/"
          className="transition-colors hover:text-brand-primary"
        >
          Home
        </Link>

        <span aria-hidden="true">/</span>

        <Link
          href="/products"
          className="transition-colors hover:text-brand-primary"
        >
          Products
        </Link>

        <span aria-hidden="true">/</span>

        <span className="font-medium text-slate-700">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={productImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          <Link
            href={`/products?category=${encodeURIComponent(categoryName)}`}
            className="absolute left-5 top-5 z-10 inline-flex cursor-pointer rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-brand-dark shadow-sm transition-colors hover:bg-brand-primary hover:text-white"
          >
            {categoryName}
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            {categoryName}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-sm font-medium text-slate-500">
            {product.unit}
          </p>

          <p className="mt-6 text-3xl font-bold text-brand-primary">
            ${product.price.toFixed(2)}
          </p>

          <div className="mt-6">
            {product.inStock ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-brand-primary"
                />
                In stock — {product.stockQuantity} available
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                Out of stock
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900">
              Product description
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {product.description ||
                "No description is currently available for this product."}
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <label
              htmlFor={`quantity-${product.id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Quantity
            </label>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex w-fit items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="cursor-pointer px-4 py-3 text-lg font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  −
                </button>

                <input
                  id={`quantity-${product.id}`}
                  type="number"
                  min={1}
                  max={Math.max(
                    1,
                    product.stockQuantity,
                  )}
                  value={quantity}
                  onChange={(event) => {
                    const nextQuantity = Number(
                      event.target.value,
                    );

                    if (
                      Number.isInteger(nextQuantity) &&
                      nextQuantity >= 1
                    ) {
                      setQuantity(
                        Math.min(
                          Math.max(
                            1,
                            product.stockQuantity,
                          ),
                          nextQuantity,
                        ),
                      );
                    }
                  }}
                  disabled={!product.inStock}
                  className="w-16 border-x border-slate-300 py-3 text-center font-semibold text-slate-900 outline-none disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    !product.inStock ||
                    quantity >= product.stockQuantity
                  }
                  aria-label="Increase quantity"
                  className="cursor-pointer px-4 py-3 text-lg font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="cursor-pointer rounded-xl bg-brand-primary px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {product.inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>

            {addedMessage && (
              <p
                role="status"
                aria-live="polite"
                className="mt-4 rounded-lg bg-brand-light px-4 py-3 text-sm font-semibold text-brand-dark"
              >
                {addedMessage}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-8">
            <Link
              href="/products"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              ← Back to products
            </Link>

            <Link
              href={`/products?category=${encodeURIComponent(categoryName)}`}
              className="rounded-xl bg-brand-light px-5 py-3 font-semibold text-brand-dark transition-colors hover:bg-brand-primary hover:text-white"
            >
              Browse {categoryName}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}