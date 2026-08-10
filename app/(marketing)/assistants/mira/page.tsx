import { AssistantDemo } from "@/components/assistant-demo";

export const metadata = {
  title: "MIRA",
};

export default function MiraPage() {
  return (
    <AssistantDemo
      name="MIRA"
      title="Your Business Intelligence AI"
      description="MIRA turns business questions into understandable analysis, explanations, and decisions."
      greeting="I can help you understand what your business data is saying."
      capabilities={[
        "Analyze KPIs and business performance",
        "Explain dashboards in clear business language",
        "Compare periods, segments, and categories",
        "Identify unusual changes and potential drivers",
        "Recommend useful visualizations",
        "Create concise executive summaries",
      ]}
      examplePrompt="MIRA, why did revenue decline this month?"
      exampleResponse="Revenue declined primarily because repeat-customer orders fell while average order value remained stable. I would next compare channel performance, customer cohorts, and product availability to isolate the main driver."
      theme="mira"
    />
  );
}
