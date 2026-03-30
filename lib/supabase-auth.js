import {
  getSupabaseClient,
  getSupabaseImplicitClient,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";

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
  const supabase = getSupabaseImplicitClient();

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

export async function fetchProfileByUsername(username) {
  const supabase = getSupabaseClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier")
    .eq("username", username)
    .single();
}

export async function fetchNotifications(recipientUserId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("notifications")
    .select(
      "id, recipient_user_id, actor_user_id, actor_username, actor_display_name, type, post_id, comment_id, read, created_at"
    )
    .eq("recipient_user_id", recipientUserId)
    .order("created_at", { ascending: false });
}

export async function createNotification(payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("notifications")
    .insert(payload)
    .select(
      "id, recipient_user_id, actor_user_id, actor_username, actor_display_name, type, post_id, comment_id, read, created_at"
    )
    .single();
}

export async function markNotificationAsRead(notificationId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .select(
      "id, recipient_user_id, actor_user_id, actor_username, actor_display_name, type, post_id, comment_id, read, created_at"
    )
    .single();
}

export async function markAllNotificationsAsRead(recipientUserId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_user_id", recipientUserId)
    .eq("read", false);
}

export function subscribeToNotifications(recipientUserId, callback) {
  if (!isSupabaseConfigured()) {
    return { unsubscribe() {} };
  }

  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`notifications:${recipientUserId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `recipient_user_id=eq.${recipientUserId}`,
      },
      callback
    )
    .subscribe();

  return {
    unsubscribe() {
      supabase.removeChannel(channel);
    },
  };
}
