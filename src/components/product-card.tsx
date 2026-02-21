import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-56 items-center justify-center bg-white p-6">
          <img
            src={product.image}
            alt={product.title}
            className="h-full max-h-40 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {product.category}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="text-amber-500">&#9733;</span>
              <span>{product.rating.rate}</span>
              <span className="text-xs">({product.rating.count})</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
