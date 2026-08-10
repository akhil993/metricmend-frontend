import { AssistantDemo } from "@/components/assistant-demo";

export const metadata = {
  title: "MINA",
};

export default function MinaPage() {
  return (
    <AssistantDemo
      name="MINA"
      title="Your Life AI Assistant"
      description="MINA helps turn everyday plans and responsibilities into clear, manageable next steps."
      greeting="I can help bring the different parts of your life together."
      capabilities={[
        "Create tasks and organized to-do lists",
        "Build budgets and track planned expenses",
        "Help plan weddings, travel, education, and home projects",
        "Understand documents and explain important information",
        "Coordinate milestones, invitations, and RSVPs",
        "Suggest practical next steps while keeping you in control",
      ]}
      examplePrompt="MINA, help me start planning my sister's wedding."
      exampleResponse="Absolutely. I can create a wedding plan with milestones, an initial budget, guest coordination, vendor tasks, and a suggested timeline. You can review everything before it is added."
      theme="mina"
    />
  );
}
