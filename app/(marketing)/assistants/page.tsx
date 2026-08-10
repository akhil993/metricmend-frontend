import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, HeartHandshake } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "Assistants",
};

export default function AssistantsPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <Bot size={42} />
        <p className="eyebrow">MetricMend AI Assistants</p>
        <h1>Meet MINA and MIRA.</h1>
        <p>
          Two specialized assistants designed for two different parts of your
          world.
        </p>
      </Reveal>

      <RevealGroup className="section assistant-directory">
        <RevealItem>
          <article className="assistant-directory-card mina-directory">
            <HeartHandshake />
            <p className="product-type">Life AI</p>
            <h2>MINA</h2>
            <p>
              MINA helps people plan, organize, understand, and manage everyday
              life inside LifeMeld.
            </p>
            <Link href="/assistants/mina">
              Meet MINA <ArrowRight size={17} />
            </Link>
          </article>
        </RevealItem>

        <RevealItem>
          <article className="assistant-directory-card mira-directory">
            <BriefcaseBusiness />
            <p className="product-type">Business AI</p>
            <h2>MIRA</h2>
            <p>
              MIRA helps business users explore data, understand performance, and
              discover actionable insights inside InsightMend.
            </p>
            <Link href="/assistants/mira">
              Meet MIRA <ArrowRight size={17} />
            </Link>
          </article>
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
