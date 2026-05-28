# Rashaun's Games

A single web app hosting all the games I've built — live at [rashaungames.com](https://rashaungames.com).

The home screen lets you pick a game, and each one lives at its own route:

| Route | Game |
|---|---|
| `/preferences` | Guess how your friends ranked their preferences. Online or pass-and-play. |
| `/catchphrase` | Two teams pass the phone describing words without saying them. Don't be holding it when time runs out. |
| `/memory` | Study a grid of numbers, colors, and shapes, then recreate it from memory. |

## Background

This repo consolidates three games that used to be separate Vite projects:

- [`rawarne2/preferences-game`](https://github.com/rawarne2/preferences-game)
- [`rawarne2/catchphrase`](https://github.com/rawarne2/catchphrase)
- [`rawarne2/memory-game`](https://github.com/rawarne2/memory-game)

Each was imported with `git subtree` so its full commit history is preserved inside this repo under `app/games/<name>/_src/`. Going forward, all development happens here — the three old repos are left in place for reference but not actively maintained.

The Socket.IO backend for Preferences still lives in its own repo, [`rawarne2/preferences-game-backend`](https://github.com/rawarne2/preferences-game-backend), deployed to Render.

## Repository layout

```
app/
  layout.tsx              # Root layout (fonts, AntdRegistry, Analytics)
  page.tsx                # Home screen with the three game cards
  icon.svg                # Favicon (🃏)
  globals.css             # Tailwind 4 entry + shadcn tokens
  preferences/            # /preferences route
    page.tsx              # Server Component
    PreferencesClient.tsx # "use client" + dynamic({ssr:false}) wrapper
    PreferencesGame.tsx   # Re-export from games/preferences/_src/src/App
  catchphrase/            # /catchphrase route (same pattern)
  memory/                 # /memory route (same pattern)
  games/
    preferences/_src/     # Imported preferences-game repo (history preserved)
    catchphrase/_src/     # Imported catchphrase repo (history preserved)
    memory/_src/          # Imported memory-game repo (history preserved)
components/
  SiteHeader.tsx          # Shared header on each game route
  ui/                     # shadcn components
lib/
public/                   # Static assets (favicon-related, catchphrase audio)
```

### Why the `_src/` subdirectory?

Each game's original source — components, context, data, configs — lives at `app/games/<name>/_src/`. The thin route directory at `app/<name>/` mounts that source as a Next.js client component. The split keeps the imported history clean and means a small `*.tsx` file per game owns the Next-specific glue (server/client boundary, `dynamic({ ssr: false })` for things that touch `window`).

`_src/` is no longer purely archival — it's the active codebase for each game. It's fine to edit anything in there; the only thing structurally locked is the `_src` prefix itself (which keeps the imported history in a recognizable subtree).

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Compiler)
- **React 18.3.1** — pinned because `react-dnd@16` (used by the Preferences drag-and-drop) is not compatible with React 19
- **TypeScript 5**
- **Tailwind CSS 4** (CSS-first config in `app/globals.css`)
- **shadcn/ui** for the home screen's components
- **Ant Design 5** for the Memory game UI (loaded via `@ant-design/nextjs-registry` so it SSRs cleanly)
- **`motion`** for Memory animations
- **`socket.io-client` + `react-dnd`** for Preferences

## Local development

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

Preferences uses a Socket.IO backend. By default `.env.local` points at the production Render backend (`wss://preferences-game-backend.onrender.com`), so online multiplayer works out of the box without running a local server.

If you want to run the backend locally (from the [`preferences-game-backend`](https://github.com/rawarne2/preferences-game-backend) repo), set it up on a port other than `3000` (since the Next.js dev server already uses 3000), and update `.env.local`:

```
NEXT_PUBLIC_WEBSOCKET_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_IS_PRODUCTION=false
```

See `.env.example` for the full list of expected variables.

## Deploy

The site deploys to Vercel. Push to `main` triggers a production deploy; PRs get preview URLs.

Environment variables (`NEXT_PUBLIC_WEBSOCKET_SERVER_URL`, `NEXT_PUBLIC_IS_PRODUCTION`) are configured per-environment in the Vercel project settings.
