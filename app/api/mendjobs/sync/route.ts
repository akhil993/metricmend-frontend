import { NextResponse } from "next/server";
import {
  classifyVisaSignal,
  classifyWorkMode,
  mendjobsAdmin,
} from "@/lib/mendjobs-supabase";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  location?: { name?: string };
  departments?: { name?: string }[];
  content?: string;
};

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.MENDJOBS_SYNC_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = mendjobsAdmin();

  const boards = (process.env.MENDJOBS_GREENHOUSE_BOARDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!boards.length) {
    return NextResponse.json({
      synced: 0,
      message: "No boards configured. Add MENDJOBS_GREENHOUSE_BOARDS.",
    });
  }

  let synced = 0;

  for (const slug of boards) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) continue;

    const payload = await response.json();
    const jobs: GreenhouseJob[] = payload.jobs || [];

    const { data: company } = await supabase
      .from("mendjobs_companies")
      .upsert(
        {
          name: slug
            .split("-")
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
            .join(" "),
          source: "greenhouse",
          source_slug: slug,
        },
        { onConflict: "source_slug" }
      )
      .select()
      .single();

    if (!company) continue;

    for (const job of jobs) {
      const fullText = `${job.title || ""} ${job.location?.name || ""} ${
        job.content || ""
      }`;

      await supabase.from("mendjobs_jobs").upsert(
        {
          company_id: company.id,
          external_id: String(job.id),
          title: job.title,
          location: job.location?.name || "Not listed",
          department: job.departments?.[0]?.name || "Not listed",
          apply_url: job.absolute_url,
          content: job.content || "",
          visa_signal: classifyVisaSignal(fullText),
          work_mode: classifyWorkMode(fullText),
          source: "greenhouse",
          is_active: true,
          posted_at: job.updated_at || null,
          synced_at: new Date().toISOString(),
        },
        { onConflict: "source,external_id" }
      );

      synced += 1;
    }
  }

  return NextResponse.json({ synced });
}
