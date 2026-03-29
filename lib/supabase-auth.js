import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}

export async function signUpWithEmail({
  email,
  password,
  username,
  displayName,
}) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName || username,
      },
    },
  });
}

export async function signInWithEmail({ email, password }) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signInWithOAuth(provider) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signInWithOAuth({
    provider,
  });
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signOut();
}
