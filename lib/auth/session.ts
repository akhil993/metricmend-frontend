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