import { classifyVisaSignal, classifyWorkMode } from "@/lib/mendjobs-supabase";

export type MendJob = {
  id: string;
  title: string;
  location: string | null;
  department: string | null;
  category: string;
  apply_url: string;
  visa_signal: string;
  work_mode: string;
  source: string;
  companies: {
    id: string;
    name: string;
    source_slug?: string;
  } | null;
};

type CompanySource = {
  name: string;
  ats: "greenhouse" | "lever" | "ashby";
  slug: string;
};

export const KNOWN_COMPANY_SOURCES: CompanySource[] = [
  { name: "Google", ats: "greenhouse", slug: "google" },
  { name: "OpenAI", ats: "greenhouse", slug: "openai" },
  { name: "Stripe", ats: "greenhouse", slug: "stripe" },
  { name: "Databricks", ats: "greenhouse", slug: "databricks" },
  { name: "Anthropic", ats: "greenhouse", slug: "anthropic" },
  { name: "Scale AI", ats: "greenhouse", slug: "scaleai" },
  { name: "Rippling", ats: "greenhouse", slug: "rippling" },
  { name: "Figma", ats: "greenhouse", slug: "figma" },
  { name: "Notion", ats: "greenhouse", slug: "notion" },
  { name: "Plaid", ats: "greenhouse", slug: "plaid" },
  { name: "Coinbase", ats: "greenhouse", slug: "coinbase" },
  { name: "Instacart", ats: "greenhouse", slug: "instacart" },
  { name: "Reddit", ats: "greenhouse", slug: "reddit" },
  { name: "Lyft", ats: "greenhouse", slug: "lyft" },
  { name: "Robinhood", ats: "greenhouse", slug: "robinhood" },
  { name: "Ramp", ats: "greenhouse", slug: "ramp" },
  { name: "Vercel", ats: "greenhouse", slug: "vercel" },
  { name: "Canva", ats: "greenhouse", slug: "canva" },
  { name: "Miro", ats: "greenhouse", slug: "miro" },
  { name: "Airtable", ats: "greenhouse", slug: "airtable" },
  { name: "Asana", ats: "greenhouse", slug: "asana" },
  { name: "Affirm", ats: "greenhouse", slug: "affirm" },
  { name: "Pinterest", ats: "greenhouse", slug: "pinterest" },
  { name: "DoorDash", ats: "greenhouse", slug: "doordashusa" },
  { name: "Dropbox", ats: "greenhouse", slug: "dropbox" },
  { name: "MongoDB", ats: "greenhouse", slug: "mongodb" },
  { name: "Okta", ats: "greenhouse", slug: "okta" },
  { name: "Twilio", ats: "greenhouse", slug: "twilio" },
  { name: "Zapier", ats: "greenhouse", slug: "zapier" },
  { name: "Grammarly", ats: "greenhouse", slug: "grammarly" },
  { name: "Quora", ats: "greenhouse", slug: "quora" },
  { name: "Wayfair", ats: "greenhouse", slug: "wayfair" },
  { name: "Airbnb", ats: "greenhouse", slug: "airbnb" },
  { name: "Uber", ats: "greenhouse", slug: "uber" },
  { name: "Cloudflare", ats: "greenhouse", slug: "cloudflare" },
  { name: "Snowflake", ats: "greenhouse", slug: "snowflake" },
  { name: "Atlassian", ats: "greenhouse", slug: "atlassian" },
  { name: "Shopify", ats: "greenhouse", slug: "shopify" },
  { name: "Square", ats: "greenhouse", slug: "square" },
  { name: "GitHub", ats: "greenhouse", slug: "github" },
  { name: "Yelp", ats: "greenhouse", slug: "yelp" },
  { name: "Box", ats: "greenhouse", slug: "boxinc" },
  { name: "Confluent", ats: "greenhouse", slug: "confluent" },
  { name: "HashiCorp", ats: "greenhouse", slug: "hashicorp" },
  { name: "Elastic", ats: "greenhouse", slug: "elastic" },
  { name: "HubSpot", ats: "greenhouse", slug: "hubspot" },
  { name: "Coursera", ats: "greenhouse", slug: "coursera" },
  { name: "Duolingo", ats: "greenhouse", slug: "duolingo" },
  { name: "Oscar Health", ats: "greenhouse", slug: "oscar" },
  { name: "Toast", ats: "greenhouse", slug: "toast" },
  { name: "SoFi", ats: "greenhouse", slug: "sofi" },
  { name: "Gusto", ats: "greenhouse", slug: "gusto" },
  { name: "Flexport", ats: "greenhouse", slug: "flexport" },
  { name: "Circle", ats: "greenhouse", slug: "circle" },

  { name: "Netflix", ats: "lever", slug: "netflix" },
  { name: "NVIDIA", ats: "lever", slug: "nvidia" },
  { name: "Brex", ats: "lever", slug: "brex" },
  { name: "Mercury", ats: "lever", slug: "mercury" },
  { name: "Benchling", ats: "lever", slug: "benchling" },
  { name: "Chime", ats: "lever", slug: "chime" },
  { name: "Gemini", ats: "lever", slug: "gemini" },
  { name: "Headway", ats: "lever", slug: "headway" },
  { name: "Hightouch", ats: "lever", slug: "hightouch" },
  { name: "Navan", ats: "lever", slug: "navan" },
  { name: "Postman", ats: "lever", slug: "postman" },
  { name: "Retool", ats: "lever", slug: "retool" },
  { name: "Samsara", ats: "lever", slug: "samsara" },
  { name: "Webflow", ats: "lever", slug: "webflow" },
  { name: "Palantir", ats: "lever", slug: "palantir" },
  { name: "Anduril", ats: "lever", slug: "anduril" },
  { name: "Rivian", ats: "lever", slug: "rivian" },
  { name: "Discord", ats: "lever", slug: "discord" },
  { name: "Twitch", ats: "lever", slug: "twitch" },
  { name: "Niantic", ats: "lever", slug: "niantic" },
  { name: "Wealthsimple", ats: "lever", slug: "wealthsimple" },
  { name: "Faire", ats: "lever", slug: "faire" },
  { name: "Carta", ats: "lever", slug: "carta" },

  { name: "Perplexity", ats: "ashby", slug: "perplexity" },
  { name: "Harvey", ats: "ashby", slug: "harvey" },
  { name: "Cursor", ats: "ashby", slug: "cursor" },
  { name: "Clay", ats: "ashby", slug: "clay" },
  { name: "Cohere", ats: "ashby", slug: "cohere" },
  { name: "Linear", ats: "ashby", slug: "linear" },
  { name: "Tailscale", ats: "ashby", slug: "tailscale" },
  { name: "LangChain", ats: "ashby", slug: "langchain" },
  { name: "Modal", ats: "ashby", slug: "modal" },
  { name: "Runway", ats: "ashby", slug: "runway" },
  { name: "Sourcegraph", ats: "ashby", slug: "sourcegraph" },
];

export function classifyJobCategory(title: string, department?: string | null) {
  const text = `${title} ${department || ""}`.toLowerCase();

  if (text.includes("analytics engineer") || text.includes("semantic")) {
    return "Analytics Engineering";
  }

  if (
    text.includes("business intelligence") ||
    text.includes("bi ") ||
    text.includes("power bi") ||
    text.includes("tableau") ||
    text.includes("looker") ||
    text.includes("reporting")
  ) {
    return "BI / Reporting";
  }

  if (
    text.includes("data engineer") ||
    text.includes("data platform") ||
    text.includes("etl") ||
    text.includes("pipeline")
  ) {
    return "Data Engineering";
  }

  if (
    text.includes("data scientist") ||
    text.includes("machine learning") ||
    text.includes("ml ") ||
    text.includes("ai ")
  ) {
    return "Data Science / ML";
  }

  if (
    text.includes("analytics manager") ||
    text.includes("data manager") ||
    text.includes("director") ||
    text.includes("head of")
  ) {
    return "Analytics Leadership";
  }

  if (
    text.includes("software engineer") ||
    text.includes("frontend") ||
    text.includes("backend") ||
    text.includes("full stack") ||
    text.includes("platform engineer")
  ) {
    return "Software Engineering";
  }

  if (text.includes("product manager") || text.includes("product")) {
    return "Product";
  }

  return "Other";
}

function relevantJob(title: string, department?: string | null) {
  return classifyJobCategory(title, department) !== "Other";
}

async function fetchWithTimeout(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchGreenhouse(company: CompanySource): Promise<MendJob[]> {
  const res = await fetchWithTimeout(
    `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`
  );

  if (!res.ok) return [];

  const payload = await res.json();
  const jobs = payload.jobs || [];

  return jobs
    .slice(0, 100)
    .map((job: any) => {
      const department = job.departments?.[0]?.name || "Department not listed";
      const fullText = `${job.title || ""} ${job.location?.name || ""} ${
        job.content || ""
      }`;

      return {
        id: `${company.ats}-${company.slug}-${job.id}`,
        title: job.title,
        location: job.location?.name || "Location not listed",
        department,
        category: classifyJobCategory(job.title, department),
        apply_url: job.absolute_url,
        visa_signal: classifyVisaSignal(fullText),
        work_mode: classifyWorkMode(fullText),
        source: "company careers",
        companies: {
          id: company.slug,
          name: company.name,
          source_slug: company.slug,
        },
      };
    });
}

async function fetchLever(company: CompanySource): Promise<MendJob[]> {
  const res = await fetchWithTimeout(
    `https://api.lever.co/v0/postings/${company.slug}?mode=json`
  );

  if (!res.ok) return [];

  const jobs = await res.json();

  return jobs
    .slice(0, 100)
    .map((job: any) => {
      const department = job.categories?.team || "Department not listed";
      const fullText = `${job.text || ""} ${job.descriptionPlain || ""} ${
        job.categories?.location || ""
      }`;

      return {
        id: `${company.ats}-${company.slug}-${job.id}`,
        title: job.text,
        location: job.categories?.location || "Location not listed",
        department,
        category: classifyJobCategory(job.text, department),
        apply_url: job.hostedUrl,
        visa_signal: classifyVisaSignal(fullText),
        work_mode: classifyWorkMode(fullText),
        source: "company careers",
        companies: {
          id: company.slug,
          name: company.name,
          source_slug: company.slug,
        },
      };
    });
}

async function fetchAshby(company: CompanySource): Promise<MendJob[]> {
  const res = await fetchWithTimeout(
    `https://api.ashbyhq.com/posting-api/job-board/${company.slug}`
  );

  if (!res.ok) return [];

  const payload = await res.json();
  const jobs = payload.jobs || [];

  return jobs
    .slice(0, 100)
    .map((job: any) => {
      const department = job.department || "Department not listed";
      const fullText = `${job.title || ""} ${job.location || ""} ${
        job.description || ""
      }`;

      return {
        id: `${company.ats}-${company.slug}-${job.id}`,
        title: job.title,
        location: job.location || "Location not listed",
        department,
        category: classifyJobCategory(job.title, department),
        apply_url: job.jobUrl,
        visa_signal: classifyVisaSignal(fullText),
        work_mode: classifyWorkMode(fullText),
        source: "company careers",
        companies: {
          id: company.slug,
          name: company.name,
          source_slug: company.slug,
        },
      };
    });
}

export async function fetchLiveMendJobs() {
  const batches: CompanySource[][] = [];

  for (let index = 0; index < KNOWN_COMPANY_SOURCES.length; index += 12) {
    batches.push(KNOWN_COMPANY_SOURCES.slice(index, index + 12));
  }

  const settledBatches = [];

  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(async (company) => {
        if (company.ats === "greenhouse") return fetchGreenhouse(company);
        if (company.ats === "lever") return fetchLever(company);
        return fetchAshby(company);
      })
    );

    settledBatches.push(...batchResults);
  }

  const jobs = settledBatches.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  const deduped = new Map<string, MendJob>();

  jobs.forEach((job) => {
    const key = `${job.companies?.name}-${job.title}-${job.location}`.toLowerCase();

    if (!deduped.has(key)) {
      deduped.set(key, job);
    }
  });

  return Array.from(deduped.values()).slice(0, 1200);
}
