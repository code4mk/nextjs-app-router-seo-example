import Link from "next/link";
import axiosInstance from "@/lib/axios";
import type { Product } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<Product[]>("/products");
  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kamal Shop
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
              All Products
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
              Categories
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Featured Products
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Discover our handpicked selection of quality products at the best prices.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
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
          ))}
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
