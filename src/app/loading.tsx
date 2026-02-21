import ProductCardSkeleton from "@/components/skeletons/product-card-skeleton";

export default function HomeLoading() {
  return (
    <>
      <div className="mb-10">
        <div className="h-9 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-5 w-96 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCardSkeleton count={8} />
      </div>
    </>
  );
}
