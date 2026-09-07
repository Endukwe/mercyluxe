"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/interiors", label: "Interiors" },
  { href: "/hospitality", label: "Hospitality" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-onyx/8 bg-ivory/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Logo variant="compact" onDark={!scrolled} priority />

        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`label-luxe text-[11px] transition-colors hover:text-gold ${
                  active ? "text-gold" : "text-onyx/80"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/book"
            className="label-luxe rounded-full bg-onyx px-6 py-3 text-[11px] text-ivory transition-transform duration-200 hover:bg-onyx-soft active:scale-[0.97]"
          >
            Book a Consultation
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="text-onyx lg:hidden"
          aria-label="Open menu"
        >
          <List size={26} weight="light" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ivory px-6 pt-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <Logo variant="compact" />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={26} weight="light" />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-8">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl tracking-wide text-onyx"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="label-luxe mt-6 rounded-full bg-onyx px-6 py-4 text-center text-xs text-ivory"
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
