import { Mail, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <Reveal as="section" className="empty-state section" y={16}>
        <div className="empty-icon">
          <Mail size={34} />
        </div>
        <p className="eyebrow">Contact MetricMend AI</p>
        <h1>Better ways to reach us are coming soon.</h1>
        <p>
          We are preparing our official contact, support, and partnership
          channels.
        </p>
        <div className="coming-pill">
          <Sparkles size={15} />
          Coming soon
        </div>
      </Reveal>
    </main>
  );
}
