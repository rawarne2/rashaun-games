import { SiteHeader } from "@/components/SiteHeader";
import { PreferencesClient } from "./PreferencesClient";

export const metadata = { title: "Preferences — Rashaun Games" };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <PreferencesClient />
    </>
  );
}
