"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icon";

const ALL_LINKS = [
  { href: "#showcase", label: "ai-bots" },
  { href: "#work", label: "Work" },
  { href: "#live", label: "Activity" },
  { href: "#skills", label: "Skills" },
  { href: "#hackathons", label: "Hackathons" },
  { href: "#contact", label: "Contact" },
];

export function Nav({ shortName, resumeUrl, showShowcase = true }: { shortName: string; resumeUrl: string; showShowcase?: boolean }) {
  const LINKS = showShowcase ? ALL_LINKS : ALL_LINKS.filter((l) => l.href !== "#showcase");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        aria-label="Main"
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4 transition-all duration-300 sm:px-5 ${
          scrolled || open ? "glass shadow-[0_10px_40px_-15px_rgba(0,0,0,.8)]" : ""
        }`}
      >
        <a href="#top" className="text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          {shortName}
          <span className="text-plasma">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 text-sm text-mute transition-colors hover:bg-slate-2 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          {resumeUrl && (
            <li className="ml-2">
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-9 text-sm">
                Résumé
              </a>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} className="size-6" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-void/70 backdrop-blur-sm md:hidden"
          />
        )}
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass relative mx-auto mt-2 max-w-6xl !bg-slate p-2 shadow-[0_30px_80px_-10px_rgba(0,0,0,.95)] md:hidden"
          >
            <ul>
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold active:bg-slate-2"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary m-2 flex"
                onClick={() => setOpen(false)}
              >
                <Icon name="doc" className="size-4" /> Read my résumé
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
