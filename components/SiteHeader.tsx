import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
        >
          Rashaun <span className="text-orange">Games</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-md border border-line-strong bg-raised px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-raised-hover"
        >
          ← Home
        </Link>
      </div>
    </header>
  );
}
