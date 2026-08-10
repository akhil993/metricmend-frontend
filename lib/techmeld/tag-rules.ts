export const TECHMELD_TOPIC_TAGS = [
  "AI",
  "Cloud",
  "Analytics",
  "Data Engineering",
  "Software Development",
] as const;

export type TechMeldTopicTag = (typeof TECHMELD_TOPIC_TAGS)[number];

const KEYWORD_RULES: Array<{ tag: TechMeldTopicTag; pattern: RegExp }> = [
  {
    tag: "AI",
    pattern: /\b(ai|artificial intelligence|machine learning|\bml\b|llm|generative|genai|neural|copilot|\bagent(s)?\b)\b/i,
  },
  {
    tag: "Cloud",
    pattern: /\b(cloud|kubernetes|k8s|serverless|infrastructure|compute|region|availability zone|container)\b/i,
  },
  {
    tag: "Analytics",
    pattern: /\b(analytics|business intelligence|\bbi\b|dashboard|reporting|metrics|\bkpi\b)\b/i,
  },
  {
    tag: "Data Engineering",
    pattern: /\b(data engineering|pipeline|\betl\b|\belt\b|warehouse|lakehouse|database|data lake)\b/i,
  },
  {
    tag: "Software Development",
    pattern: /\b(developer|\bsdk\b|\bapi\b|framework|open source|programming|repository|github|changelog)\b/i,
  },
];

export function inferTopicTags(text: string): TechMeldTopicTag[] {
  const matches = KEYWORD_RULES.filter((rule) => rule.pattern.test(text)).map(
    (rule) => rule.tag
  );
  return Array.from(new Set(matches));
}
