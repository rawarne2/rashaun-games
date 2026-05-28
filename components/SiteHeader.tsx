import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-700/40 bg-blue-50/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-blue-900"
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
