"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

// Marketing chrome (Nav + Footer) for the public site only. The /admin area is
// standalone - no site nav, and therefore no link into it from the website.
export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
