"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input id={id} type={type} className="field" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

/** URL / path input with a live thumbnail preview. */
export function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="flex items-center gap-3">
          <input
            id={id}
            className="field"
            value={value}
            placeholder="/projects/app.jpg or https://…"
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
          />
          <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-void text-[10px] text-mute">
            {value && !broken ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="size-full object-cover" onError={() => setBroken(true)} />
            ) : value ? (
              "can't load"
            ) : (
              "none"
            )}
          </span>
        </div>
      )}
    </Field>
  );
}

export function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      {(id) => (
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          className="field tabular-nums"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || "0", 10)))}
        />
      )}
    </Field>
  );
}

export function TextArea({ label, value, onChange, hint, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => <textarea id={id} rows={rows} className="field resize-y" value={value} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${checked ? "border-plasma bg-plasma/80" : "border-line bg-slate-2"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          className={`absolute top-0.5 size-4.5 rounded-full bg-ink ${checked ? "right-0.5" : "left-0.5"}`}
        />
      </button>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-mute">{hint}</span>}
      </span>
    </label>
  );
}

/** Chip input: type a value, press Enter or comma to add it. */
export function ChipInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  function commit() {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...values];
    for (const p of parts) if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next);
    setDraft("");
  }
  return (
    <Field label={label} hint="Press Enter or comma to add.">
      {(id) => (
        <div className="field flex flex-wrap items-center gap-1.5 !py-1.5">
          {values.map((v, i) => (
            <span key={v} className="flex items-center gap-1 rounded-full bg-void px-2.5 py-1 text-sm">
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                className="grid size-5 place-items-center rounded-full text-mute hover:bg-danger/20 hover:text-danger"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={id}
            value={draft}
            placeholder={values.length ? "" : placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                commit();
              } else if (e.key === "Backspace" && !draft && values.length) {
                onChange(values.slice(0, -1));
              }
            }}
            onBlur={commit}
            className="min-w-[8rem] flex-1 bg-transparent py-1 outline-none placeholder:text-[#59647a]"
          />
        </div>
      )}
    </Field>
  );
}

/**
 * Generic ordered list editor: collapsible rows with move up/down and a
 * two-step delete (no browser confirm dialogs).
 */
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  title,
  subtitle,
  render,
  create,
  addLabel,
  emptyText,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  title: (item: T) => string;
  subtitle?: (item: T) => ReactNode;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  create: () => T;
  addLabel: string;
  emptyText: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const update = (id: string, patch: Partial<T>) => onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line p-6 text-center text-mute">{emptyText}</p>}
      <motion.ul layout className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className={`overflow-hidden rounded-xl border bg-slate ${isOpen ? "border-plasma/50" : "border-line"}`}
              >
                <div className="flex items-center gap-1 p-2 pl-4">
                  <button
                    type="button"
                    className="min-w-0 flex-1 py-2 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                  >
                    <span className="block truncate font-semibold">{title(item) || "Untitled"}</span>
                    {subtitle && <span className="block truncate text-xs text-mute">{subtitle(item)}</span>}
                  </button>
                  <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </IconBtn>
                  <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </IconBtn>
                  <IconBtn label={isOpen ? "Collapse" : "Edit"} onClick={() => setOpen(isOpen ? null : item.id)}>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="inline-block">
                      ⌄
                    </motion.span>
                  </IconBtn>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <div className="space-y-4 border-t border-line p-4">
                        {render(item, (patch) => update(item.id, patch))}
                        <div className="flex justify-end gap-2 pt-2">
                          {confirming === item.id ? (
                            <>
                              <button type="button" className="btn btn-ghost !min-h-10 text-sm" onClick={() => setConfirming(null)}>
                                Keep it
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger !min-h-10 text-sm"
                                onClick={() => {
                                  onChange(items.filter((x) => x.id !== item.id));
                                  setConfirming(null);
                                  setOpen(null);
                                }}
                              >
                                Yes, delete
                              </button>
                            </>
                          ) : (
                            <button type="button" className="btn btn-danger !min-h-10 text-sm" onClick={() => setConfirming(item.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
      <button
        type="button"
        className="btn btn-ghost mt-4 w-full border-dashed sm:w-auto"
        onClick={() => {
          const it = create();
          onChange([...items, it]);
          setOpen(it.id);
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-lg text-mute transition-colors hover:bg-slate-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
