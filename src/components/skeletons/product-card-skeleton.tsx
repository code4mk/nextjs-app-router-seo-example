export default function ProductCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="h-56 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-3 flex items-center justify-between">
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
