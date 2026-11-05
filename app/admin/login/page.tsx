"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Couldn't sign in. Try again.");
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div aria-hidden className="pointer-events-none fixed left-1/2 top-1/3 size-[30rem] -translate-x-1/2 rounded-full bg-plasma/15 blur-[120px]" />
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass relative w-full max-w-sm p-7"
      >
        <h1 className="text-2xl font-bold tracking-tight">Sign in to edit your site</h1>
        <p className="mt-1 text-sm text-mute">Only the site owner can open the dashboard.</p>

        <label htmlFor="password" className="mt-6 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field mt-1.5"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || !password} className="btn btn-primary mt-6 w-full disabled:opacity-50">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="mt-4 block text-center text-sm text-mute hover:text-ink">
          Back to the site
        </a>
      </motion.form>
    </main>
  );
}
