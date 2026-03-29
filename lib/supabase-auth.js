import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}

export async function getCurrentSupabaseSession() {
  if (!isSupabaseConfigured()) {
    return { data: { session: null }, error: null };
  }

  const supabase = getSupabaseBrowserClient();
  return supabase.auth.getSession();
}

export function subscribeToSupabaseAuthChanges(callback) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe() {} } } };
  }

  const supabase = getSupabaseBrowserClient();
  return supabase.auth.onAuthStateChange(callback);
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
      emailRedirectTo: "https://phlexr.com/app-shell",
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

export async function upsertProfileRow({
  id,
  username,
  displayName,
  bio = "",
  location = "",
  avatarUrl = "",
  membershipTier = "Free",
}) {
  const supabase = getSupabaseBrowserClient();

  return supabase.from("profiles").upsert(
    {
      id,
      username,
      display_name: displayName,
      bio,
      location,
      avatar_url: avatarUrl,
      membership_tier: membershipTier,
    },
    { onConflict: "id" }
  );
}

export async function fetchProfileRow(userId) {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier")
    .eq("id", userId)
    .single();
}
