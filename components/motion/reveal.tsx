"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Element tag to render as — 'div' works inside any container, including grids. */
  as?: "div" | "section";
};

/**
 * Fades and slides an element up as it scrolls into view. Runs once.
 *
 * `initial`/`whileInView` always describe the same shape on server and
 * client — only `transition` duration/delay collapse to 0 for
 * prefers-reduced-motion. Branching `initial` itself (e.g. to `false`)
 * would make the server-rendered inline style disagree with the first
 * client render whenever the visitor's OS motion preference differs from
 * the server's no-preference default, causing a hydration mismatch.
 */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = as === "section" ? motion.section : motion.div;
  const duration = shouldReduceMotion ? 0 : 0.7;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay: shouldReduceMotion ? 0 : delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/** Wraps a grid/list; each RevealItem child staggers in behind it. Transparent to CSS Grid/Flex layout on the parent. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const groupVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}

/** One grid/list cell inside a RevealGroup. Renders as a plain div — a normal CSS Grid item, so parent grid layout is unaffected. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: EASE } },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
