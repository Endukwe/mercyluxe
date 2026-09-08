"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarBlank, ListChecks, Plus, SignOut } from "@phosphor-icons/react";

const LINKS = [
  { href: "/admin", label: "Bookings", icon: ListChecks, exact: true },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarBlank },
  { href: "/admin/new", label: "New booking", icon: Plus },
];

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-onyx/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="font-display text-xl tracking-[0.1em] text-onyx">Mercy Luxe</span>
          <span className="label-luxe text-[10px] text-gold">Studio</span>
        </div>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? "bg-onyx text-ivory" : "text-onyx/70 hover:bg-onyx/5"
                }`}
              >
                <l.icon size={16} weight="regular" />
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-onyx/70 transition-colors hover:bg-onyx/5"
            title="Sign out"
          >
            <SignOut size={16} weight="regular" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
