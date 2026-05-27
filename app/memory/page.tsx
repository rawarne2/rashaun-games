import { SiteHeader } from "@/components/SiteHeader";
import { MemoryClient } from "./MemoryClient";

export const metadata = { title: "Memory — Rashaun Games" };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <MemoryClient />
    </>
  );
}
