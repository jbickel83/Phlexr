import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}

export async function initializeSupabaseSessionFromUrl() {
  if (!isSupabaseConfigured() || typeof window === "undefined") {
    return { data: { session: null }, error: null };
  }

  const supabase = getSupabaseClient();
  return supabase.auth.getSession();
}

export async function getCurrentSupabaseSession() {
  if (!isSupabaseConfigured()) {
    return { data: { session: null }, error: null };
  }

  const supabase = getSupabaseClient();
  return supabase.auth.getSession();
}

export function subscribeToSupabaseAuthChanges(callback) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe() {} } } };
  }

  const supabase = getSupabaseClient();
  return supabase.auth.onAuthStateChange(callback);
}

export async function signUpWithEmail({
  email,
  password,
  username,
  displayName,
  emailRedirectTo,
}) {
  const supabase = getSupabaseClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        username,
        display_name: displayName || username,
      },
    },
  });
}

export async function signInWithEmail({ email, password }) {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signInWithOAuth(provider) {
  const supabase = getSupabaseClient();

  return supabase.auth.signInWithOAuth({
    provider,
  });
}

export async function sendPasswordResetEmail({ email, redirectTo }) {
  const supabase = getSupabaseClient();

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function updateSupabasePassword(password) {
  const supabase = getSupabaseClient();

  return supabase.auth.updateUser({
    password,
  });
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const supabase = getSupabaseClient();
  return supabase.auth.signOut();
}

export async function fetchProfileRow(userId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier")
    .eq("id", userId)
    .single();
}
