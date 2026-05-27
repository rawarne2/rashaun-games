"use client";

import dynamic from "next/dynamic";

// The archival catchphrase source constructs `new Audio(...)` at module
// evaluation time (see `_src/src/utils/sound.ts`). That would crash
// during SSR/prerender, so we load the game in the browser only.
const CatchphraseGame = dynamic(
  () => import("./CatchphraseGame").then((m) => m.CatchphraseGame),
  { ssr: false },
);

export function CatchphraseClient() {
  return <CatchphraseGame />;
}
