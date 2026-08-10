import { NextResponse } from "next/server";
import { isAuthorizedBearerRequest } from "@/lib/techmeld/admin-auth";
import { runIngestion } from "@/lib/techmeld/ingestion";

export const dynamic = "force-dynamic";

// Vercel Cron sends GET and auto-attaches `Authorization: Bearer $CRON_SECRET`
// only when the secret env var is literally named CRON_SECRET. We accept
// either that or TECHMELD_INGEST_SECRET (the name documented in
// docs/techmeld.md) so both Vercel-native cron and an external scheduler
// (GitHub Actions, curl, etc.) work. POST is also supported for manual runs.
function isAuthorized(request: Request): boolean {
  const header = request.headers.get("authorization");
  return (
    isAuthorizedBearerRequest(header, process.env.TECHMELD_INGEST_SECRET) ||
    isAuthorizedBearerRequest(header, process.env.CRON_SECRET)
  );
}

async function handleIngest(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runIngestion();
  return NextResponse.json(summary, { status: 200 });
}

export async function GET(request: Request) {
  return handleIngest(request);
}

export async function POST(request: Request) {
  return handleIngest(request);
}
