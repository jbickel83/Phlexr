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

export async function clearSupabaseBrowserSession() {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const supabase = getSupabaseClient();
  return supabase.auth.signOut({ scope: "local" });
}

export async function fetchProfileRow(userId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier, is_founder")
    .eq("id", userId)
    .single();
}

export async function fetchProfileByUsername(username) {
  const supabase = getSupabaseClient();

  return supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, membership_tier, is_founder")
    .eq("username", username)
    .single();
}

export async function updateProfileRow(userId, payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("id, username, display_name, bio, location, avatar_url, membership_tier, is_founder")
    .single();
}

export async function fetchFeedPosts() {
  const supabase = getSupabaseClient();

  return supabase
    .from("posts")
    .select(
      "id, user_id, username, display_name, badge, image_url, caption, category, score, would_flex_percent, fake_ai_percent, boosted, boost_level, boosted_at, created_at"
    )
    .order("created_at", { ascending: false });
}

export async function createPostRow(payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("posts")
    .insert(payload)
    .select(
      "id, user_id, username, display_name, badge, image_url, caption, category, score, would_flex_percent, fake_ai_percent, boosted, boost_level, boosted_at, created_at"
    )
    .single();
}

export async function updatePostRow(postId, payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("posts")
    .update(payload)
    .eq("id", postId)
    .select(
      "id, user_id, username, display_name, badge, image_url, caption, category, score, would_flex_percent, fake_ai_percent, boosted, boost_level, boosted_at, created_at"
    )
    .single();
}

export async function deletePostRow(postId) {
  const supabase = getSupabaseClient();

  return supabase.from("posts").delete().eq("id", postId);
}

export async function fetchCommentsForPosts(postIds) {
  const supabase = getSupabaseClient();

  if (!Array.isArray(postIds) || postIds.length === 0) {
    return { data: [], error: null };
  }

  return supabase
    .from("comments")
    .select("id, post_id, user_id, username, display_name, text, report_reason, is_reported, hidden, created_at")
    .in("post_id", postIds)
    .order("created_at", { ascending: true });
}

export async function createCommentRow(payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("comments")
    .insert(payload)
    .select("id, post_id, user_id, username, display_name, text, report_reason, is_reported, hidden, created_at")
    .single();
}

export async function deleteCommentRow(commentId) {
  const supabase = getSupabaseClient();

  return supabase.from("comments").delete().eq("id", commentId);
}

export async function reportCommentRow(commentId, reportReason) {
  const supabase = getSupabaseClient();

  return supabase
    .from("comments")
    .update({ is_reported: true, report_reason: reportReason })
    .eq("id", commentId)
    .select("id, post_id, user_id, username, display_name, text, report_reason, is_reported, hidden, created_at")
    .single();
}

export async function fetchFollowingRows(followerUserId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("follows")
    .select("id, follower_user_id, follower_username, following_user_id, following_username, created_at")
    .eq("follower_user_id", followerUserId);
}

export async function createFollowRow(payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("follows")
    .insert(payload)
    .select("id, follower_user_id, follower_username, following_user_id, following_username, created_at")
    .single();
}

export async function deleteFollowRow(followerUserId, followingUserId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("follows")
    .delete()
    .eq("follower_user_id", followerUserId)
    .eq("following_user_id", followingUserId);
}

export async function fetchVoteRows(voterUserId) {
  const supabase = getSupabaseClient();

  return supabase
    .from("post_votes")
    .select("id, post_id, voter_user_id, vote_type, created_at")
    .eq("voter_user_id", voterUserId);
}

export async function upsertVoteRow(payload) {
  const supabase = getSupabaseClient();

  return supabase
    .from("post_votes")
    .upsert(payload, { onConflict: "post_id,voter_user_id" })
    .select("id, post_id, voter_user_id, vote_type, created_at")
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
