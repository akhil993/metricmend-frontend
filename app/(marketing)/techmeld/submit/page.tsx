import type { Metadata } from "next";
import { SubmissionForm } from "@/components/techmeld/submission-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Submit to TechMeld",
  description:
    "Suggest an event, article, tool, learning resource, hackathon, or meetup for editorial review on TechMeld.",
  alternates: { canonical: "/techmeld/submit" },
};

export default function SubmitPage() {
  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">Community Submissions</p>
        <h1>Know something TechMeld should cover?</h1>
        <p>
          Suggest an event, article, tool, learning resource, hackathon, or
          meetup. Every submission is reviewed by an editor before it appears
          publicly — nothing is published automatically.
        </p>
      </Reveal>

      <Reveal as="section" className="section techmeld-subpage-content techmeld-submit-section">
        <SubmissionForm />
      </Reveal>
    </main>
  );
}
