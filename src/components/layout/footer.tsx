export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Kamal Shop. All rights reserved.
      </div>
    </footer>
  );
}
