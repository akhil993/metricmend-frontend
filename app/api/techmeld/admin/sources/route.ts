import { NextResponse } from "next/server";
import { listSources, setSourceEnabled } from "@/lib/techmeld/admin";
import { isAuthorizedBearerRequest } from "@/lib/techmeld/admin-auth";

export const dynamic = "force-dynamic";

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
    const sources = await listSources();
    return NextResponse.json({ sources });
  } catch {
    return NextResponse.json({ error: "Could not load sources." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  let body: { id?: string; enabled?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "id and enabled are required." }, { status: 400 });
  }

  try {
    const result = await setSourceEnabled(body.id, body.enabled);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update source." }, { status: 502 });
  }
}
