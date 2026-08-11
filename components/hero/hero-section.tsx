"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MMMonogram } from "@/components/brand/mm-monogram";

const EASE = [0.16, 1, 0.3, 1] as const;

// initial/show always describe the same shape on server and client — only
// the transition duration collapses to 0 for prefers-reduced-motion, so the
// first client render matches the SSR output and hydration never mismatches.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0 : 0.7, ease: EASE };

  return (
    <section className="mm-hero" id="welcome" data-section-label="Welcome">
      <motion.div
        className="mm-hero-content"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div className="mm-hero-mark" variants={fadeUp} transition={transition}>
          <span className="mm-monogram-wrap">
            <MMMonogram size={140} decorative />
          </span>
        </motion.div>

        <motion.p className="mm-hero-brandname" variants={fadeUp} transition={transition}>
          MetricMend AI
        </motion.p>

        <motion.div variants={fadeUp} transition={transition}>
          <h1 className="mm-hero-heading">
            One AI company.
            <br />
            Intelligence for work, life, and technology.
          </h1>
        </motion.div>

        <motion.p className="mm-hero-lead" variants={fadeUp} transition={transition}>
          MetricMend AI builds connected AI products on one shared
          intelligence platform—helping people and businesses understand
          more, decide clearly, and act with confidence.
        </motion.p>

        <motion.div className="mm-hero-actions" variants={fadeUp} transition={transition}>
          <Link href="/products" className="primary-button">
            Explore Products
            <ArrowRight size={17} />
          </Link>
          <Link href="/contact" className="secondary-button">
            Contact us
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
