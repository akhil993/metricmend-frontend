import { NextResponse } from "next/server";
import { subscribeToNewsletter, type SubscribeInput } from "@/lib/techmeld/subscribe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Partial<SubscribeInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid", message: "Invalid request body." }, { status: 400 });
  }

  const outcome = await subscribeToNewsletter({
    email: typeof body.email === "string" ? body.email : "",
    firstName: typeof body.firstName === "string" ? body.firstName : undefined,
    interests: Array.isArray(body.interests)
      ? body.interests.filter((interest): interest is string => typeof interest === "string")
      : undefined,
    honeypot: typeof body.honeypot === "string" ? body.honeypot : undefined,
  });

  switch (outcome.status) {
    case "subscribed":
      return NextResponse.json({ status: "subscribed" }, { status: 201 });
    case "already_subscribed":
      return NextResponse.json({ status: "already_subscribed" }, { status: 200 });
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
