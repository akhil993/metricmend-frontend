import { createClient } from "@/lib/supabase/client";

export async function getCurrentUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authenticated user not found.");
  }

  return user.id;
}

export async function getCurrentAccessToken() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Authenticated session not found.");
  }

  return session.access_token;
}
