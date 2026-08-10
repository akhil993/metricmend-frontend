import { NextResponse } from "next/server";
import { listPendingSubmissions, reviewSubmission } from "@/lib/techmeld/admin";
import { isAuthorizedBearerRequest } from "@/lib/techmeld/admin-auth";
import type { TechMeldSubmissionStatus } from "@/types/techmeld";

export const dynamic = "force-dynamic";

const VALID_STATUSES: TechMeldSubmissionStatus[] = ["pending", "approved", "rejected"];

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAuthorized(request: Request) {
  return isAuthorizedBearerRequest(
    request.headers.get("authorization"),
    process.env.TECHMELD_ADMIN_SECRET
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const submissions = await listPendingSubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Could not load submissions." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  let body: { id?: string; status?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id || !body.status || !VALID_STATUSES.includes(body.status as TechMeldSubmissionStatus)) {
    return NextResponse.json({ error: "id and a valid status are required." }, { status: 400 });
  }

  try {
    const result = await reviewSubmission(body.id, body.status as TechMeldSubmissionStatus);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update submission." }, { status: 502 });
  }
}
