import Link from "next/link";

const games = [
  {
    href: "/preferences",
    title: "Preferences",
    description:
      "Guess how your friends ranked their preferences. Online or pass-and-play on one device.",
    accent: "bg-brand",
    text: "text-brand-soft",
  },
  {
    href: "/catchphrase",
    title: "Catchphrase",
    description:
      "Two teams pass the phone, describing words without saying them. Don't be holding it when time runs out.",
    accent: "bg-orange",
    text: "text-orange",
  },
  {
    href: "/memory",
    title: "Memory",
    description:
      "Study a grid of numbers, colors, and shapes, then recreate it from memory.",
    accent: "bg-success",
    text: "text-success-soft",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12">
      <header className="text-center">
        <h1 className="font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Rashaun&apos;s <span className="text-orange">Games</span>
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Pick a game to play.
        </p>
      </header>

      <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-line-strong hover:bg-raised sm:p-6"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 ${game.accent}`}
              aria-hidden
            />
            <h2 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {game.title}
            </h2>
            <p className="mt-2 flex-1 text-base leading-relaxed text-muted-foreground">
              {game.description}
            </p>
            <span
              className={`mt-6 inline-flex items-center gap-1 text-base font-semibold ${game.text}`}
            >
              Play
              <span aria-hidden className="transition group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
