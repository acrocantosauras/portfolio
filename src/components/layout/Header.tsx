"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mark } from "@/components/ui/Mark";
import { useRecruiterMode } from "./RecruiterModeContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#identity", label: "Identity" },
  { href: "#journey", label: "Journey" },
  { href: "#workshop", label: "Workshop" },
  { href: "#missions", label: "Missions" },
  { href: "#casefile", label: "Case File" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggle } = useRecruiterMode();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-hairline bg-ink/95"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          data-sense="true"
          aria-label="Back to top"
        >
          <Mark />
          <span className="font-display text-lg tracking-wider text-paper">
            MEET JADHAV
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-sense="true"
              className="font-mono text-[11px] tracking-[0.2em] text-paper-dim uppercase transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            data-sense="true"
            className="hidden items-center gap-2 border border-signal-red/70 bg-signal-red/10 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-signal-red-bright uppercase transition-colors hover:bg-signal-red/20 sm:flex"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-red-bright opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-red-bright" />
            </span>
            Recruiter Mode
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-hairline text-paper lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="flex flex-col gap-1">
              <span className="h-[1.5px] w-4 bg-paper" />
              <span className="h-[1.5px] w-4 bg-paper" />
              <span className="h-[1.5px] w-4 bg-paper" />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-hairline bg-ink px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                toggle();
                setMobileOpen(false);
              }}
              className="mt-1 flex items-center gap-2 border border-signal-red/70 bg-signal-red/10 px-3.5 py-2 font-mono text-xs tracking-[0.2em] text-signal-red-bright uppercase"
            >
              Recruiter Mode
            </button>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
