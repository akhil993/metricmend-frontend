import { mendjobsPublic } from "@/lib/mendjobs-supabase";
import { fetchLiveMendJobs } from "@/lib/mendjobs-sources";
import MendJobsClient from "./MendJobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function MendJobsPage() {
  const supabase = mendjobsPublic();

  const { data: dbJobs } = await supabase
    .from("mendjobs_jobs")
    .select(
      "id,title,location,department,apply_url,visa_signal,work_mode,source,posted_at,companies:mendjobs_companies(id,name,source_slug)"
    )
    .eq("is_active", true)
    .order("synced_at", { ascending: false })
    .limit(100);

  const { data: comments } = await supabase
    .from("mendjobs_comments")
    .select(
      "id,comment,display_name,created_at,companies:mendjobs_companies(id,name)"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const jobs = dbJobs?.length ? dbJobs : await fetchLiveMendJobs();

  return (
    <MendJobsClient
      jobs={(jobs || []) as any}
      comments={(comments || []) as any}
    />
  );
}
