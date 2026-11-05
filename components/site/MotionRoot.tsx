"use client";

import { MotionConfig } from "framer-motion";

/** Makes every Framer Motion animation honour the OS "reduce motion" setting. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
