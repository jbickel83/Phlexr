import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}

function getHashParams(hash) {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(value);
}

export async function initializeSupabaseSessionFromUrl() {
  if (!isSupabaseConfigured() || typeof window === "undefined") {
    return { data: { session: null }, error: null };
  }

  const supabase = getSupabaseBrowserClient();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return { data: { session: null }, error };
    }

    window.history.replaceState({}, "", url.pathname);
    return supabase.auth.getSession();
  }

  if (window.location.hash) {
    const hashParams = getHashParams(window.location.hash);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { data: { session: null }, error };
      }

      window.history.replaceState({}, "", url.pathname);
      return supabase.auth.getSession();
    }
  }

  return supabase.auth.getSession();
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
  emailRedirectTo,
}) {
  const supabase = getSupabaseBrowserClient();

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

export async function sendPasswordResetEmail({ email, redirectTo }) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function updateSupabasePassword(password) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.updateUser({
    password,
  });
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signOut();
}

export async function fetchProfileRow(userId) {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier")
    .eq("id", userId)
    .single();
}
