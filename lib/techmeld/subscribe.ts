import { getServiceSupabaseClient } from "./supabase/service-client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export interface SubscribeInput {
  email: string;
  firstName?: string;
  interests?: string[];
  /** Hidden form field — a real visitor never fills it in. */
  honeypot?: string;
}

export interface ValidatedSubscribeInput {
  email: string;
  firstName: string | null;
  interests: string[];
}

export function validateSubscribeInput(
  input: SubscribeInput
): ValidatedSubscribeInput | { error: string } {
  if (input.honeypot) {
    return { error: "Submission rejected." };
  }

  const email = input.email?.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const firstName = input.firstName?.trim().slice(0, 100) || null;
  const interests = Array.from(
    new Set((input.interests ?? []).map((interest) => interest.trim()).filter(Boolean))
  ).slice(0, 10);

  return { email, firstName, interests };
}

export type SubscribeOutcome =
  | { status: "subscribed" }
  | { status: "already_subscribed" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

export async function subscribeToNewsletter(input: SubscribeInput): Promise<SubscribeOutcome> {
  const validated = validateSubscribeInput(input);
  if ("error" in validated) {
    return { status: "invalid", message: validated.error };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    return { status: "error", message: "Newsletter storage is not configured yet." };
  }

  const { data: existing } = await client
    .from("techmeld_subscribers")
    .select("id, status")
    .eq("email", validated.email)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from("techmeld_subscribers")
      .update({
        first_name: validated.firstName,
        interests: validated.interests,
        status: existing.status === "unsubscribed" ? "active" : existing.status,
        unsubscribed_at: existing.status === "unsubscribed" ? null : undefined,
      })
      .eq("id", existing.id);

    if (error) return { status: "error", message: "Could not update your subscription." };
    return { status: "already_subscribed" };
  }

  const { error } = await client.from("techmeld_subscribers").insert({
    email: validated.email,
    first_name: validated.firstName,
    interests: validated.interests,
    status: "active",
    consented_at: new Date().toISOString(),
    source: "techmeld",
  });

  if (error) return { status: "error", message: "Could not save your subscription." };
  return { status: "subscribed" };
}
