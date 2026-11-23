"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "@/components/ui/Mark";
import { useRecruiterMode } from "./RecruiterModeContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#aegisforge", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#missions", label: "Projects" },
  { href: "#workshop", label: "Skills" },
  { href: "#identity", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { toggle, open: recruiterOpen } = useRecruiterMode();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active-section tracking
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-paper transition-colors duration-300",
        scrolled
          ? "border-b border-hairline bg-ink/95"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <Mark />
          <span className="font-display text-lg tracking-wider">
            MEET JADHAV
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={cn(
                "relative text-[13px] tracking-wide transition-colors",
                active === item.href
                  ? "text-paper"
                  : "text-paper-dim hover:text-paper"
              )}
            >
              {item.label}
              {active === item.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-signal-red-bright"
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={recruiterOpen}
            className="hidden border border-hairline px-3.5 py-1.5 text-[13px] tracking-wide text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright sm:block"
          >
            Recruiter view
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-hairline bg-ink lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-3" aria-label="Mobile">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-2.5 text-base",
                    active === item.href ? "text-paper" : "text-paper-dim"
                  )}
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
                className="mt-1 border border-hairline px-3.5 py-2.5 text-left text-base text-paper"
              >
                Recruiter view
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
