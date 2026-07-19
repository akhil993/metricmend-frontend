import { createClient } from "@supabase/supabase-js";

export function mendjobsAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function mendjobsPublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing public Supabase env vars");
  }

  return createClient(url, key);
}

export function classifyVisaSignal(text: string) {
  const value = text.toLowerCase();

  if (
    value.includes("will not sponsor") ||
    value.includes("without sponsorship") ||
    value.includes("no visa sponsorship") ||
    value.includes("unable to sponsor")
  ) {
    return "no_sponsorship";
  }

  if (
    value.includes("visa sponsorship") ||
    value.includes("h-1b") ||
    value.includes("h1b") ||
    value.includes("sponsorship available")
  ) {
    return "sponsorship_possible";
  }

  if (
    value.includes("u.s. citizen") ||
    value.includes("us citizen") ||
    value.includes("security clearance")
  ) {
    return "usc_gc_likely";
  }

  return "unclear";
}

export function classifyWorkMode(text: string) {
  const value = text.toLowerCase();

  if (value.includes("remote")) return "remote";
  if (value.includes("hybrid")) return "hybrid";
  if (value.includes("onsite") || value.includes("on-site")) return "onsite";

  return "unknown";
}
