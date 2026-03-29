import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

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

  const supabase = getSupabaseClient();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const accessTokenFromQuery = url.searchParams.get("access_token");
  const refreshTokenFromQuery = url.searchParams.get("refresh_token");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("[PHLEXR auth] exchangeCodeForSession error", error);
      return { data: { session: null }, error };
    }

    console.log("[PHLEXR auth] exchanged code for session");
    window.history.replaceState({}, "", url.pathname);
    const sessionResult = await supabase.auth.getSession();
    console.log("[PHLEXR auth] session after code exchange", sessionResult);
    return sessionResult;
  }

  if (accessTokenFromQuery && refreshTokenFromQuery) {
    const { error } = await supabase.auth.setSession({
      access_token: accessTokenFromQuery,
      refresh_token: refreshTokenFromQuery,
    });

    if (error) {
      console.log("[PHLEXR auth] setSession query error", error);
      return { data: { session: null }, error };
    }

    console.log("[PHLEXR auth] restored session from query tokens");
    window.history.replaceState({}, "", url.pathname);
    const sessionResult = await supabase.auth.getSession();
    console.log("[PHLEXR auth] session after query token restore", sessionResult);
    return sessionResult;
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
        console.log("[PHLEXR auth] setSession hash error", error);
        return { data: { session: null }, error };
      }

      console.log("[PHLEXR auth] restored session from hash tokens");
      window.history.replaceState({}, "", url.pathname);
      const sessionResult = await supabase.auth.getSession();
      console.log("[PHLEXR auth] session after hash token restore", sessionResult);
      return sessionResult;
    }
  }

  const sessionResult = await supabase.auth.getSession();
  console.log("[PHLEXR auth] session without URL recovery", sessionResult);
  return sessionResult;
}

export async function getCurrentSupabaseSession() {
  if (!isSupabaseConfigured()) {
    return { data: { session: null }, error: null };
  }

  const supabase = getSupabaseClient();
  const result = await supabase.auth.getSession();
  console.log("[PHLEXR auth] getSession", result.data?.session ?? null);
  console.log("[PHLEXR auth] getSession full result", result);
  return result;
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

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("[PHLEXR auth] signInWithPassword data", result.data);
  console.log("[PHLEXR auth] signInWithPassword error", result.error);
  console.log("[PHLEXR auth] session after login", result.data?.session ?? null);

  const sessionResult = await supabase.auth.getSession();
  console.log("[PHLEXR auth] getSession immediately after login", sessionResult);
  return result;
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
