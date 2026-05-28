import Link from "next/link";

const games = [
  {
    href: "/preferences",
    title: "Preferences",
    description:
      "Guess how your friends ranked their preferences. Online or pass-and-play on one device.",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    href: "/catchphrase",
    title: "Catchphrase",
    description:
      "Two teams pass the phone, describing words without saying them. Don't be holding it when time runs out.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    href: "/memory",
    title: "Memory",
    description:
      "Study a grid of numbers, colors, and shapes — then recreate it from memory.",
    accent: "from-slate-500 to-zinc-700",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-12">
      <header className="text-center">
        <h1 className="bg-gradient-to-r from-blue-700 via-blue-500 to-sky-500 bg-clip-text font-sans text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Rashaun Games
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Pick a game to play.
        </p>
      </header>

      <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card p-6 transition hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${game.accent}`}
              aria-hidden
            />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              {game.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {game.description}
            </p>
            <span
              className={`mt-6 inline-flex items-center gap-1 bg-gradient-to-r ${game.accent} bg-clip-text text-sm font-medium text-transparent`}
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
