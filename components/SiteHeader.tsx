import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-cyan-500/10 backdrop-blur">
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-700 via-blue-500 to-sky-500 bg-clip-text font-semibold tracking-tight text-transparent"
        >
          Rashaun Games
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
      </div>
    </header>
  );
}
