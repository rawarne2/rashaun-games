import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const games = [
  {
    href: "/preferences",
    title: "Preferences",
    description: "Guess how your friends ranked their preferences. Online multiplayer.",
  },
  {
    href: "/catchphrase",
    title: "Catchphrase",
    description: "Beat the timer describing words to your team.",
  },
  {
    href: "/memory",
    title: "Memory",
    description: "Classic card-matching memory game.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 p-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">RashaunGames</h1>
        <p className="mt-3 text-lg text-muted-foreground">Pick a game to play.</p>
      </header>
      <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {games.map((game) => (
          <Link key={game.href} href={game.href} className="block">
            <Card className="h-full transition hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">Play →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
