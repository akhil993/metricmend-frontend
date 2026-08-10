"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

type AssistantDemoProps = {
  name: string;
  title: string;
  description: string;
  greeting: string;
  capabilities: string[];
  examplePrompt: string;
  exampleResponse: string;
  theme: "mina" | "mira";
};

// initial/animate always describe the same shape on server and client —
// only durations collapse to 0 for prefers-reduced-motion, so the first
// client render matches the SSR output and hydration never mismatches.
export function AssistantDemo({
  name,
  title,
  description,
  greeting,
  capabilities,
  examplePrompt,
  exampleResponse,
  theme,
}: AssistantDemoProps) {
  const noMotion = useReducedMotion();
  const d = (value: number) => (noMotion ? 0 : value);

  return (
    <main className={`assistant-page assistant-${theme}`}>
      <section className="assistant-hero section">
        <motion.div
          className="assistant-avatar"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: d(0.6) }}
        >
          <Bot size={40} />
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.15), duration: d(0.4) }}
        >
          InsightMend powered by Mira
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.25), duration: d(0.4) }}
        >
          Hi, I&apos;m {name}.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.4), duration: d(0.4) }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="assistant-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.5), duration: d(0.4) }}
        >
          {description}
        </motion.p>
      </section>

      <section className="section assistant-content">
        <div>
          <p className="eyebrow">What I can do</p>
          <h2>{greeting}</h2>

          <div className="capability-list">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability}
                className="capability-item"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: d(index * 0.08), duration: d(0.4) }}
              >
                <Sparkles size={17} />
                <span>{capability}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="chat-demo"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: d(0.5) }}
        >
          <div className="chat-header">
            <span className="status-dot" />
            {name} is ready
          </div>

          <div className="chat-message user-message">{examplePrompt}</div>

          <motion.div
            className="chat-message assistant-message"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: d(0.6), duration: d(0.4) }}
          >
            {exampleResponse}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
