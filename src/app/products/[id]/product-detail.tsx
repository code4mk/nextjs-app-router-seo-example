"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductDetail({ product }: { product: Product }) {
  useEffect(() => {
    // example: track product view, analytics, etc.
    console.log(`Viewed product: ${product.title}`);
  }, [product.id]);

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating.rate));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Kamal Shop
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
              All Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

            <div className="flex items-center gap-2">
              <div className="flex">
                {stars.map((filled, i) => (
                  <span key={i} className={filled ? "text-amber-500" : "text-zinc-300 dark:text-zinc-600"}>
                    &#9733;
                  </span>
                ))}
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

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
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} Kamal Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
