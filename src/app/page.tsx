import axiosInstance from "@/lib/axios";
import type { Product } from "@/types/product";
import ProductCard from "@/components/product-card";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<Product[]>("/products");
  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
