"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import StarRating from "@/components/star-rating";

export default function ProductDetail({ product }: { product: Product }) {
  useEffect(() => {
    console.log(`Viewed product: ${product.title}`);
  }, [product.id]);

  return (
    <>
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        &larr; Back to products
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-10 dark:border-zinc-800">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-96 w-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {product.title}
          </h1>

          <StarRating rate={product.rating.rate} count={product.rating.count} />

          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            ${product.price.toFixed(2)}
          </p>

          <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
              Add to Cart
            </button>
            <button className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
