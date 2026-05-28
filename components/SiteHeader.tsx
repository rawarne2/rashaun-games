import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-500/30 bg-gradient-to-r from-blue-500/20 via-sky-500/20 to-cyan-500/20 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-800 via-blue-600 to-sky-600 bg-clip-text text-lg font-bold tracking-tight text-transparent"
        >
          Rashaun Games
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-md border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          ← Home
        </Link>
      </div>
    </header>
  );
}
