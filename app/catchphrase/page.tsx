import { SiteHeader } from "@/components/SiteHeader";
import { CatchphraseClient } from "./CatchphraseClient";

export const metadata = { title: "Catchphrase — RashaunGames" };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <CatchphraseClient />
    </>
  );
}
