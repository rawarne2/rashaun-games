"use client";
import dynamic from "next/dynamic";

// react-dnd registers a backend that touches `window`, react-device-detect reads
// `navigator` at import time, and socket.io-client connects in useEffect — render
// only on the client.
const PreferencesGame = dynamic(
  () => import("./PreferencesGame").then((m) => m.PreferencesGame),
  { ssr: false },
);

export function PreferencesClient() {
  return <PreferencesGame />;
}
