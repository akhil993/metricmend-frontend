"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CalendarDays, RadioTower } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

// initial/animate always describe the same shape on server and client —
// only durations collapse to 0 for prefers-reduced-motion, so the first
// client render matches the SSR output and hydration never mismatches.
export function TechMeldHero() {
  const noMotion = useReducedMotion();
  const d = (value: number) => (noMotion ? 0 : value);

  return (
    <section className="techmeld-hero" id="techmeld-overview" data-section-label="Overview">
      <div className="techmeld-grid-background" aria-hidden="true" />
      <div className="techmeld-glow techmeld-glow-left" aria-hidden="true" />
      <div className="techmeld-glow techmeld-glow-right" aria-hidden="true" />

      <div className="techmeld-hero-content">
        <motion.div
          className="techmeld-hero-icon"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: d(0.6), ease: EASE }}
        >
          <RadioTower />
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.15), duration: d(0.4), ease: EASE }}
        >
          TechMeld
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.22), duration: d(0.7), ease: EASE }}
        >
          Technology,
          <span> brought together.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.36), duration: d(0.6), ease: EASE }}
        >
          Discover important AI news, cloud events, product releases, learning,
          tools, global job opportunities, and industry gatherings in one useful place.
        </motion.p>

        <motion.div
          className="techmeld-hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.48), duration: d(0.6), ease: EASE }}
        >
          <a href="#ai-news" className="primary-button">
            Explore latest news
            <ArrowRight size={17} />
          </a>

          <Link href="/techmeld/events" className="secondary-button">
            <CalendarDays size={17} />
            Browse events
          </Link>

          <Link href="/techmeld/opportunities" className="secondary-button">
            <BriefcaseBusiness size={17} />
            Find opportunities
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
