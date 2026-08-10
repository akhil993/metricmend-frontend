import { NextResponse } from "next/server";
import {
  editEvent,
  listPendingEvents,
  setEventFeatured,
  setEventStatus,
} from "@/lib/techmeld/admin";
import { isAuthorizedBearerRequest } from "@/lib/techmeld/admin-auth";
import type { TechMeldEventStatus } from "@/types/techmeld";

export const dynamic = "force-dynamic";

const VALID_STATUSES: TechMeldEventStatus[] = [
  "pending",
  "approved",
  "cancelled",
  "completed",
  "archived",
];

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
    const events = await listPendingEvents();
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Could not load pending events." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  let body: {
    id?: string;
    status?: string;
    featured?: boolean;
    fields?: { description?: string; category?: string; tags?: string[] };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  try {
    if (body.status) {
      if (!VALID_STATUSES.includes(body.status as TechMeldEventStatus)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      const result = await setEventStatus(body.id, body.status as TechMeldEventStatus);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    }

    if (typeof body.featured === "boolean") {
      const result = await setEventFeatured(body.id, body.featured);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    }

    if (body.fields) {
      const result = await editEvent(body.id, body.fields);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update event." }, { status: 502 });
  }
}
