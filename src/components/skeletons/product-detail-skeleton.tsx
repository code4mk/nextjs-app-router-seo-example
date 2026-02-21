export default function ProductDetailSkeleton() {
  return (
    <>
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="flex h-96 animate-pulse items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />

        <div className="flex flex-col gap-5">
          <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mt-4 flex gap-3">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </>
  );
}
