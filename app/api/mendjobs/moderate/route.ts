import { NextResponse } from "next/server";
import OpenAI from "openai";

const blockedPatterns = [
  /\b(kill|die|threat|attack)\b/i,
  /\b(racist|casteist)\b/i,
  /\b(go back to your country)\b/i,
  /\b(slur|hate speech)\b/i,
];

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({
        allowed: false,
        message: "Please write a valid comment.",
      });
    }

    if (blockedPatterns.some((pattern) => pattern.test(text))) {
      return NextResponse.json({
        allowed: false,
        message:
          "Your comment violates our community policy. Discrimination, harassment, threats, or abusive language are not allowed on MendJobs.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ allowed: true });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });

    const flagged = moderation.results?.[0]?.flagged;

    if (flagged) {
      return NextResponse.json({
        allowed: false,
        message:
          "Your comment violates our community policy. Please rewrite it respectfully. Discrimination, harassment, hateful language, or abuse is not allowed.",
      });
    }

    return NextResponse.json({ allowed: true });
  } catch {
    return NextResponse.json(
      {
        allowed: false,
        message: "Unable to review this comment right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
