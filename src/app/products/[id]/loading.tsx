export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kamal Shop
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
}
