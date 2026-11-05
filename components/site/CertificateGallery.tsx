"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Certificate } from "@/lib/schema";
import { Icon } from "./Icon";

/** Grid of certificate thumbnails; clicking one opens it full size in a dialog. */
export function CertificateGallery({ items }: { items: Certificate[] }) {
  const [open, setOpen] = useState<Certificate | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="glass group block w-full overflow-hidden text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_var(--color-ion)]"
            >
              <div className="relative aspect-[1.414] overflow-hidden rounded-t-[18px] border-b border-line bg-slate-2">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt={`${c.title} certificate`}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 ease-[var(--ease-snap)] group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-mute">
                    <Icon name="award" className="size-10" />
                  </div>
                )}
                <span className="absolute inset-0 grid place-items-center bg-void/0 opacity-0 transition-all duration-300 group-hover:bg-void/45 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-void">
                    <Icon name="expand" className="size-4" /> View
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3 p-4">
                <Icon name="award" className="mt-0.5 size-5 shrink-0 text-ion" />
                <div className="min-w-0">
                  <p className="font-semibold leading-snug">{c.title}</p>
                  <p className="mt-0.5 text-sm text-mute">{[c.issuer, c.date].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        className="m-auto max-h-[92dvh] w-[min(64rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 text-ink backdrop:bg-void/80 backdrop:backdrop-blur-sm"
        aria-label={open?.title}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass !bg-slate overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-line p-3 pl-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{open.title}</p>
                  <p className="truncate text-sm text-mute">{[open.issuer, open.date].filter(Boolean).join(" · ")}</p>
                </div>
                {open.url && (
                  <a href={open.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 text-sm">
                    Original <Icon name="arrow" className="size-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="grid size-10 place-items-center rounded-full text-mute transition-colors hover:bg-slate-2 hover:text-ink"
                  aria-label="Close"
                  autoFocus
                >
                  <Icon name="close" className="size-5" />
                </button>
              </div>
              {open.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={open.image} alt={`${open.title} certificate`} className="max-h-[78dvh] w-full bg-void object-contain" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
