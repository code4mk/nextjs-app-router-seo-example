import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Kamal Shop
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            All Products
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
}
