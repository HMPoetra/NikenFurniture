import type { Variants } from "framer-motion";

/* ─────────────────────────────────────────────
   Shared entrance variants
   • Small offsets  → no horizontal scroll on mobile
   • once: true     → animate only on first enter
───────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ─────────────────────────────────────────────
   Stagger containers
───────────────────────────────────────────── */

/** Default stagger — cards, grids */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Slower stagger — hero text lines */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

/* ─────────────────────────────────────────────
   Shared viewport config
   once: true  → replay is expensive, skip it
   margin      → trigger slightly before element enters
───────────────────────────────────────────── */

export const viewport = { once: true, margin: "-72px" } as const;
