import { NextResponse } from "next/server";
import { submitCommunityEntry, type SubmissionInput } from "@/lib/techmeld/submissions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Partial<SubmissionInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid", message: "Invalid request body." }, { status: 400 });
  }

  const outcome = await submitCommunityEntry({
    submissionType: typeof body.submissionType === "string" ? body.submissionType : "",
    title: typeof body.title === "string" ? body.title : "",
    sourceUrl: typeof body.sourceUrl === "string" ? body.sourceUrl : "",
    description: typeof body.description === "string" ? body.description : undefined,
    submittedByName: typeof body.submittedByName === "string" ? body.submittedByName : undefined,
    submittedByEmail: typeof body.submittedByEmail === "string" ? body.submittedByEmail : undefined,
    honeypot: typeof body.honeypot === "string" ? body.honeypot : undefined,
  });

  switch (outcome.status) {
    case "submitted":
      return NextResponse.json({ status: "submitted" }, { status: 201 });
    case "invalid":
      return NextResponse.json({ status: "invalid", message: outcome.message }, { status: 400 });
    case "error":
    default:
      return NextResponse.json(
        { status: "error", message: "Something went wrong. Please try again." },
        { status: 502 }
      );
  }
}
