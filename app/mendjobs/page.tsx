import { mendjobsPublic } from "@/lib/mendjobs-supabase";
import {
  classifyJobCategory,
  fetchLiveMendJobs,
  type MendJob,
} from "@/lib/mendjobs-sources";
import MendJobsClient from "./MendJobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function MendJobsPage() {
  const supabase = mendjobsPublic();

  const [{ data: dbJobs }, liveJobs] = await Promise.all([
    supabase
      .from("mendjobs_jobs")
      .select(
        "id,title,location,department,apply_url,visa_signal,work_mode,source,posted_at,companies:mendjobs_companies(id,name,source_slug)"
      )
      .eq("is_active", true)
      .order("synced_at", { ascending: false })
      .limit(250),
    fetchLiveMendJobs(),
  ]);

  const { data: comments } = await supabase
    .from("mendjobs_comments")
    .select(
      "id,comment,display_name,created_at,companies:mendjobs_companies(id,name)"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const jobs = dedupeJobs([
    ...normalizeDbJobs(dbJobs || []),
    ...liveJobs,
  ]);

  return (
    <MendJobsClient
      jobs={(jobs || []) as any}
      comments={(comments || []) as any}
    />
  );
}

function normalizeDbJobs(jobs: any[]): MendJob[] {
  return jobs.map((job) => {
    const company = Array.isArray(job.companies)
      ? job.companies[0] || null
      : job.companies || null;

    return {
      id: String(job.id),
      title: String(job.title || "Untitled role"),
      location: job.location || "Location not listed",
      department: job.department || "Department not listed",
      category: job.category || classifyJobCategory(job.title, job.department),
      apply_url: String(job.apply_url || "#"),
      visa_signal: job.visa_signal || "unclear",
      work_mode: job.work_mode || "unknown",
      source: job.source || "stored posting",
      companies: company
        ? {
            id: String(company.id || company.source_slug || company.name),
            name: String(company.name || "Unknown company"),
            source_slug: company.source_slug || undefined,
          }
        : null,
    };
  });
}

function dedupeJobs(jobs: MendJob[]) {
  const deduped = new Map<string, MendJob>();

  jobs.forEach((job) => {
    const company =
      Array.isArray(job.companies)
        ? job.companies[0]?.name
        : job.companies?.name;

    const key = [
      company || "unknown",
      job.title,
      job.location || "unknown",
    ]
      .join("|")
      .toLowerCase();

    if (!deduped.has(key)) {
      deduped.set(key, job);
    }
  });

  return Array.from(deduped.values()).slice(0, 1200);
}
