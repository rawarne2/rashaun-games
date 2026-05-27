"use client";

import dynamic from "next/dynamic";

// The memory-game source touches `window` and `localStorage` at initial
// state level (e.g. `useState({ width: window.innerWidth, ... })`), so it
// must be rendered in the browser only.
const MemoryGame = dynamic(
  () => import("./MemoryGame").then((m) => m.MemoryGame),
  { ssr: false },
);

export function MemoryClient() {
  return <MemoryGame />;
}
