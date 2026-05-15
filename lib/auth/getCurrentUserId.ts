import { createClient } from "@/lib/supabase/client";

export async function getCurrentUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new Error("Unable to resolve current user");
  }

  return user.id;
}