import { NextResponse } from "next/server";
import OpenAI from "openai";
import { mendjobsAdmin } from "@/lib/mendjobs-supabase";

const localBlocked = [
  /go back to your country/i,
  /kill yourself/i,
  /terrorist/i,
  /racial slur/i,
  /caste/i,
];

async function isAllowed(text: string) {
  if (localBlocked.some((pattern) => pattern.test(text))) {
    return {
      allowed: false,
      reason:
        "Discrimination, harassment, hateful language, or abusive comments are not allowed.",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return { allowed: true, reason: "local_check_passed" };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const result = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: text,
  });

  if (result.results?.[0]?.flagged) {
    return {
      allowed: false,
      reason:
        "This comment violates community policy. Please rewrite it respectfully.",
    };
  }

  return { allowed: true, reason: "moderation_passed" };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company_id, comment, display_name } = body;

    if (!company_id || !comment || typeof comment !== "string") {
      return NextResponse.json(
        { error: "Company and comment are required." },
        { status: 400 }
      );
    }

    const review = await isAllowed(comment);
    const supabase = mendjobsAdmin();

    await supabase.from("mendjobs_moderation_logs").insert({
      comment_text: comment,
      allowed: review.allowed,
      reason: review.reason,
    });

    if (!review.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          message:
            "Your comment violates our community policy. Discrimination, harassment, threats, or abusive language are not allowed on MendJobs.",
        },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("mendjobs_comments").insert({
      company_id,
      display_name: display_name || "Anonymous",
      comment,
      status: "approved",
    });

    if (error) throw error;

    return NextResponse.json({ allowed: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to post comment." },
      { status: 500 }
    );
  }
}
