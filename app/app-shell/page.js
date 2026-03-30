"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import TurnstileWidget, { canUseTurnstile } from "@/components/auth/TurnstileWidget";
import { PhlexrWordmark } from "@/components/brand/PhlexrLogo";
import { accountMenuSections } from "@/lib/account-pages";
import {
  canUseSupabaseAuth,
  clearSupabaseBrowserSession,
  createCommentRow,
  castPostVote,
  createFollowRow,
  createNotification,
  createPostRow,
  deleteCommentRow,
  deleteFollowRow,
  deletePostRow,
  fetchCommentsForPosts,
  fetchFeedPosts,
  fetchNotifications,
  fetchFollowingRows,
  fetchProfileByUsername,
  fetchProfileRow,
  fetchVoteRows,
  getCurrentSupabaseSession,
  getCurrentSupabaseUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  reportCommentRow,
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
  subscribeToNotifications,
  subscribeToSupabaseAuthChanges,
  updatePostRow,
  updateProfileRow,
} from "@/lib/supabase-auth";

const shellNav = [
  { label: "Feed", view: "feed" },
  { label: "Post", view: "post" },
  { label: "Leaderboard", view: "leaderboard" },
];

const categories = [
  "Houses",
  "Cars",
  "Watches",
  "Shoes",
  "Boats",
  "Handbags",
  "Dresses",
  "Suits",
  "Gaming Setups",
  "Backyards",
  "Garages",
  "Misc",
];

const POSTS_STORAGE_KEY = "phlexr-app-shell-posts";
const VOTED_POSTS_STORAGE_KEY = "phlexr-app-shell-voted-posts";
const PROFILE_STORAGE_KEY = "phlexr-app-shell-current-profile";
const COMMENTS_STORAGE_KEY = "phlexr-app-shell-comments";
const SAFETY_STORAGE_KEY = "phlexr-app-shell-safety";
const MEMBERSHIP_STORAGE_KEY = "phlexr-app-shell-membership";
const FOLLOWING_STORAGE_KEY = "phlexr-app-shell-following";
const SEED_VERSION_STORAGE_KEY = "phlexr-app-shell-seed-version";
const APP_SHELL_SEED_VERSION = "2026-03-28-josh-james-v11";
const FOUNDER_USERNAME = "phlexrfounder";
const FOUNDER_EMAIL = "phlexrapp@gmail.com";
const DEFAULT_PROFILE_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23110f0c'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%23c8a24d' fill-opacity='0.95'/%3E%3Cpath d='M34 136c8-24 27-38 46-38s38 14 46 38' fill='%23c8a24d' fill-opacity='0.95'/%3E%3C/svg%3E";

const demoCurrentUserProfile = {
  id: null,
  username: FOUNDER_USERNAME,
  email: FOUNDER_EMAIL,
  displayName: "Josh James",
  badge: "Elite",
  avatar: "/josh-james-avatar.png",
  location: "Miami, FL",
  bio: "building phlexr. mostly cars, watches, and clean spots.",
  isFounder: true,
};

const emptyAuthenticatedUserProfile = {
  id: null,
  username: "",
  email: "",
  displayName: "",
  badge: "Basic",
  avatar: DEFAULT_PROFILE_AVATAR,
  location: "",
  bio: "",
  isFounder: false,
};

const membershipTiers = [
  {
    id: "free",
    name: "FREE",
    price: "Free",
    cta: "Choose Free",
    badge: "Free",
    features: ["2 posts", "pays full boost price"],
    accent: "border-white/10 bg-black/30",
  },
  {
    id: "basic",
    name: "BASIC",
    price: "$4.99/month",
    cta: "Choose Basic",
    badge: "Basic",
    features: ["paid membership tier", "pays full boost price"],
    accent: "border-white/10 bg-black/30",
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "$9.99/month",
    cta: "Upgrade to Premium",
    badge: "Premium",
    features: ["Premium status", "10% off boosts"],
    accent: "border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))]",
  },
  {
    id: "elite",
    name: "ELITE",
    price: "$14.99/month",
    cta: "Upgrade to Elite",
    badge: "Elite",
    features: ["Elite status", "25% off boosts"],
    accent:
      "border-[#d8b25a]/75 bg-[linear-gradient(180deg,rgba(230,179,58,0.14),rgba(255,255,255,0.03))] shadow-[0_0_26px_rgba(216,178,90,0.14)]",
  },
];

const boostOptions = [
  { value: "24h", label: "Boost 24h" },
  { value: "3d", label: "Boost 3 days" },
  { value: "7d", label: "Boost 7 days" },
];

const boostPriority = {
  "24h": 1,
  "3d": 2,
  "7d": 3,
};

function minutesAgoIso(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

const seededPosts = [
  {
    id: "post-1",
    username: "marcuslane",
    displayName: "Marcus Lane",
    badge: "Elite",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1600&auto=format&fit=crop",
    caption: "late pickup. no talk.",
    category: "Cars",
    score: 9.8,
    wouldFlexPercent: 94,
    fakeAiPercent: 3,
    createdAt: minutesAgoIso(23),
    owner: false,
    boosted: false,
    boostLevel: null,
  },
  {
    id: "post-2",
    username: "laylariv",
    displayName: "Layla Rivera",
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
    caption: "soft flex",
    category: "Handbags",
    score: 9.4,
    wouldFlexPercent: 88,
    fakeAiPercent: 7,
    createdAt: minutesAgoIso(60),
    owner: false,
    boosted: false,
    boostLevel: null,
  },
  {
    id: "post-3",
    username: "zaycole",
    displayName: "Zay Cole",
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop",
    caption: "daily",
    category: "Watches",
    score: 9.7,
    wouldFlexPercent: 91,
    fakeAiPercent: 4,
    createdAt: minutesAgoIso(180),
    owner: false,
    boosted: false,
    boostLevel: null,
  },
  {
    id: "post-4",
    username: "dantewest",
    displayName: "Dante West",
    badge: "Basic",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    caption: "nothing crazy just clean",
    category: "Houses",
    score: 9.3,
    wouldFlexPercent: 86,
    fakeAiPercent: 5,
    createdAt: minutesAgoIso(300),
    owner: false,
    boosted: false,
    boostLevel: null,
  },
  {
    id: "post-5",
    username: "phlexrfounder",
    displayName: "Josh James",
    badge: "Elite",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    caption: "clean enough",
    category: "Cars",
    score: 9.1,
    wouldFlexPercent: 85,
    fakeAiPercent: 5,
    createdAt: minutesAgoIso(12),
    owner: true,
    boosted: false,
    boostLevel: null,
  },
  {
    id: "post-6",
    username: "captainbiscuit",
    displayName: "Kyle Walters",
    badge: "Elite",
    image: "/kyle-sailboat.jpg",
    caption: "dock side. easy.",
    category: "Boats",
    score: 9.5,
    wouldFlexPercent: 90,
    fakeAiPercent: 4,
    createdAt: minutesAgoIso(95),
    owner: false,
    boosted: false,
    boostLevel: null,
  },
];

const seededComments = [
  {
    id: "comment-seed-1",
    postId: "post-1",
    username: "zaycole",
    displayName: "Zay Cole",
    text: "engine?",
    createdAt: minutesAgoIso(18),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-2",
    postId: "post-1",
    username: "dantewest",
    displayName: "Dante West",
    text: "clean",
    createdAt: minutesAgoIso(12),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-3",
    postId: "post-2",
    username: "marcuslane",
    displayName: "Marcus Lane",
    text: "hard",
    createdAt: minutesAgoIso(48),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-4",
    postId: "post-2",
    username: "captainbiscuit",
    displayName: "Kyle Walters",
    text: "color crazy",
    createdAt: minutesAgoIso(36),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-5",
    postId: "post-3",
    username: "laylariv",
    displayName: "Layla Rivera",
    text: "daily",
    createdAt: minutesAgoIso(150),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-6",
    postId: "post-3",
    username: "marcuslane",
    displayName: "Marcus Lane",
    text: "what year?",
    createdAt: minutesAgoIso(142),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-7",
    postId: "post-4",
    username: "zaycole",
    displayName: "Zay Cole",
    text: "not it",
    createdAt: minutesAgoIso(262),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-8",
    postId: "post-4",
    username: "laylariv",
    displayName: "Layla Rivera",
    text: "clean yard tho",
    createdAt: minutesAgoIso(255),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-9",
    postId: "post-5",
    username: "dantewest",
    displayName: "Dante West",
    text: "cap",
    createdAt: minutesAgoIso(8),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-10",
    postId: "post-5",
    username: "marcuslane",
    displayName: "Marcus Lane",
    text: "hard",
    createdAt: minutesAgoIso(6),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-11",
    postId: "post-6",
    username: "laylariv",
    displayName: "Layla Rivera",
    text: "soft flex",
    createdAt: minutesAgoIso(74),
    isReported: false,
    hidden: false,
  },
  {
    id: "comment-seed-12",
    postId: "post-6",
    username: "phlexrfounder",
    displayName: "Josh James",
    text: "boat hard",
    createdAt: minutesAgoIso(69),
    isReported: false,
    hidden: false,
  },
];

const profileDirectory = {
  marcuslane: {
    avatar: "/marcus-avatar.jpg",
    location: "Miami, FL",
  },
  laylariv: {
    avatar: "/layla-avatar.jpg",
    location: "Los Angeles, CA",
  },
  zaycole: {
    avatar:
      "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?q=80&w=300&auto=format&fit=crop",
    location: "Dubai, UAE",
  },
  dantewest: {
    avatar: "/dante-avatar.jpg",
    location: "Aspen, CO",
  },
  captainbiscuit: {
    avatar: "/biscuit-avatar-square.jpg",
    location: "Newport Beach, CA",
  },
};

function SectionCard({ id, eyebrow, title, copy, children, hideHeader = false }) {
  return (
    <section
      id={id}
      className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-6"
    >
      {hideHeader ? null : (
        <>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">{copy}</p>
        </>
      )}
      <div className={hideHeader ? "" : "mt-8"}>{children}</div>
    </section>
  );
}

function normalizeStatus(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (!normalized) {
    return "Free";
  }

  if (normalized.includes("free")) {
    return "Free";
  }

  if (normalized.includes("elite")) {
    return "Elite";
  }

  if (normalized.includes("premium") || normalized.includes("gold verified")) {
    return "Premium";
  }

  return "Basic";
}

function PremiumBadge({ children, tone = "premium", className = "" }) {
  const toneClass =
    tone === "free" || tone === "basic"
      ? "border-white/15 bg-white/[0.03] text-white"
      : tone === "elite"
        ? "border-gold/30 bg-[#2b200f] font-bold text-gold"
        : "border-white/18 bg-white/[0.03] text-[#c0c0c0]";

  return (
    <span
      className={`inline-flex h-9 w-fit items-center justify-center whitespace-nowrap rounded-full border px-3 py-0 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] sm:h-auto sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em] ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}

function Avatar({ src, alt, sizeClass, borderClass = "border-gold/45", imageClass = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-full border ${borderClass} ${sizeClass}`}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover object-center ${imageClass}`}
      />
    </div>
  );
}

function PasswordVisibilityIcon({ visible }) {
  return visible ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18m-7.9-3.2A8.8 8.8 0 0 1 12 18c-5 0-8.8-6-8.8-6a17 17 0 0 1 4.3-4.8m3-1.6A8.9 8.9 0 0 1 12 6c5 0 8.8 6 8.8 6a16.7 16.7 0 0 1-3.6 4.3M9.9 9.9a3 3 0 0 0 4.2 4.2"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.8 12S6.6 6 12 6s9.2 6 9.2 6-3.8 6-9.2 6S2.8 12 2.8 12Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ShareIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 7.25h8.75l-2.5-2.5" />
      <path d="M16.75 7.25l-2.5 2.5" />
      <path d="M16 16.75H7.25l2.5 2.5" />
      <path d="M7.25 16.75l2.5-2.5" />
      <path d="M7.25 7.25c-1.85 1.2-3 3.02-3 4.75s1.15 3.55 3 4.75" />
      <path d="M16.75 7.25c1.85 1.2 3 3.02 3 4.75s-1.15 3.55-3 4.75" />
    </svg>
  );
}

function CameraIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.75 7.75h3.1l1.4-2h5.5l1.4 2h3.1a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H4.75a2 2 0 0 1-2-2v-7.5a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13.25" r="3.25" />
    </svg>
  );
}

function MembershipPlansPanel({ selectedMembershipId, setSelectedMembershipId, currentUser }) {
  const selectedMembership =
    membershipTiers.find((tier) => tier.id === selectedMembershipId) || membershipTiers[0];
  const isFounderAccount = Boolean(currentUser?.id) && isFounderIdentity(currentUser);
  const hasAuthenticatedAccount = Boolean(currentUser?.id);

  return (
    <div className="rounded-[1.6rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-5">
      <PremiumBadge>PHLEXR membership tiers</PremiumBadge>
      <h3 className="mt-5 text-2xl font-semibold text-white">Membership</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {membershipTiers.map((tier) => {
          const isSelected = selectedMembershipId === tier.id;
          const isElite = tier.id === "elite";
          const isStatusTier = tier.id === "premium" || tier.id === "elite";

          return (
              <div
                key={tier.id}
                className={`relative flex h-full flex-col rounded-[1.45rem] border p-4 ${
                  isElite ? "pt-16" : ""
                } ${
                  isSelected
                    ? isElite
                      ? "border-gold shadow-[0_0_34px_rgba(216,178,90,0.24)] bg-[linear-gradient(180deg,rgba(230,179,58,0.2),rgba(255,255,255,0.04))]"
                      : "border-white/25"
                    : ""
                } ${tier.accent}`}
            >
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/75">{tier.name}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{tier.price}</p>
                </div>
              </div>
              {isElite ? (
                <div className="absolute right-4 top-4 z-10">
                  <PremiumBadge>Top tier</PremiumBadge>
                </div>
              ) : null}

              <div className="mt-4 flex-1 space-y-2 text-sm leading-6 text-white/68">
                {tier.features.map((feature) => (
                  <p key={feature}>{feature}</p>
                ))}
                {isStatusTier ? <p className="text-gold/85">{tier.badge}</p> : null}
              </div>

              <button
                type="button"
                onClick={() => setSelectedMembershipId(tier.id)}
                disabled={isFounderAccount}
                  className={`mt-6 inline-flex min-h-[3.75rem] w-full items-center justify-center whitespace-nowrap rounded-full border px-5 py-3 text-center text-sm font-semibold transition ${
                    isElite
                      ? isSelected
                        ? "border-gold bg-[linear-gradient(180deg,rgba(230,179,58,0.2),rgba(255,255,255,0.04))] text-[#f3cf79] shadow-[0_0_24px_rgba(216,178,90,0.18)]"
                        : "border-gold/55 bg-[linear-gradient(180deg,rgba(230,179,58,0.12),rgba(255,255,255,0.02))] text-gold shadow-[0_0_18px_rgba(216,178,90,0.12)] hover:border-gold/80 hover:text-[#f1cf7b]"
                      : isSelected
                        ? "border-white/25 bg-white/[0.05] text-white"
                      : "border-white/15 bg-white/[0.03] text-white hover:border-gold/30 hover:text-gold"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          );
        })}
      </div>

      {hasAuthenticatedAccount ? (
      <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/40 p-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.displayName}
            sizeClass="h-16 w-16"
            borderClass="border-2 border-gold/55"
          />
          <div>
            <p className="text-2xl font-semibold text-white">{currentUser.displayName}</p>
            <p className="mt-2 text-sm text-gold">
              Current plan: {selectedMembership.name} · {selectedMembership.badge}
            </p>
            {isFounderAccount ? (
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gold/75">
                Founder status · permanent Elite
              </p>
            ) : null}
          </div>
        </div>
      </div>
      ) : null}
    </div>
  );
}

function getStatusTone(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "Elite") {
    return "elite";
  }

  if (normalized === "Premium") {
    return "premium";
  }

  if (normalized === "Free") {
    return "free";
  }

  return "basic";
}

function getStatusTextClass(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "Elite") {
    return "font-bold text-gold";
  }

  if (normalized === "Premium") {
    return "text-[#c0c0c0]";
  }

  return "text-white/90";
}

function getMembershipIdFromTier(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "elite") {
    return "elite";
  }

  if (normalized === "premium") {
    return "premium";
  }

  if (normalized === "basic") {
    return "basic";
  }

  return "free";
}

function isFounderUsername(username) {
  return String(username || "").trim().toLowerCase() === FOUNDER_USERNAME;
}

function isFounderIdentity({ username, email, isFounder = false }) {
  return (
    Boolean(isFounder) ||
    isFounderUsername(username) ||
    String(email || "").trim().toLowerCase() === FOUNDER_EMAIL
  );
}

function resolveMembershipIdForProfile({ username, email, membershipTier, isFounder = false }) {
  if (isFounderIdentity({ username, email, isFounder })) {
    return "elite";
  }

  return getMembershipIdFromTier(membershipTier);
}

function getProfileBase(isAuthenticatedProfile = false) {
  return isAuthenticatedProfile ? emptyAuthenticatedUserProfile : demoCurrentUserProfile;
}

function getSeededSocialCount(username, base, range) {
  return username.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % range + base;
}

function formatPercent(value) {
  return `${Math.max(0, Math.min(99, Math.round(value)))}%`;
}

function formatScore(value) {
  return value.toFixed(1);
}

  function formatRelativeTime(value) {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return String(value);
  }

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp.getTime()) / 1000));
  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  function applyVoteChangeToPost(post, change) {
    return {
      ...post,
      score: Math.max(5.5, Math.min(10, Number((post.score + change.score).toFixed(1)))),
      wouldFlexPercent: Math.max(
        35,
        Math.min(99, Math.round(post.wouldFlexPercent + change.wouldFlexPercent))
      ),
      fakeAiPercent: Math.max(
        1,
        Math.min(60, Math.round(post.fakeAiPercent + change.fakeAiPercent))
      ),
    };
  }

function deriveIsAdult(birthdate) {
  if (!birthdate) {
    return null;
  }

  const birth = parseBirthdateValue(birthdate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthOffset = today.getMonth() - birth.getMonth();
  if (monthOffset < 0 || (monthOffset === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 18;
}

function parseBirthdateValue(value) {
  const normalizedValue = String(value || "").trim();
  const typedDateMatch = normalizedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (typedDateMatch) {
    const [, month, day, year] = typedDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return new Date(normalizedValue);
}

function formatBirthdateInput(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function triggerVoteHaptic(voteType) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const isTouchDevice =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "") ||
    navigator.maxTouchPoints > 0;

  if (!isTouchDevice || typeof navigator.vibrate !== "function") {
    return;
  }

  const vibrationPattern =
    voteType === "flex"
      ? 18
      : voteType === "notIt"
        ? 10
        : 8;

  try {
    navigator.vibrate(vibrationPattern);
  } catch {
    // Fail silently when vibration is unavailable or blocked.
  }
}

async function verifyCaptchaToken(token) {
  const response = await fetch("/api/captcha/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const result = await response.json().catch(() => ({
    success: false,
    message: "Verification failed. Try again.",
  }));

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Verification failed. Try again.");
  }
}

function moderateComment(text, isAdult) {
  const value = text.trim();
  const normalized = value.toLowerCase();

  const threatPattern =
    /\b(kill you|shoot you|stab you|i[' ]?m going to kill|i will kill|beat your ass|find you and hurt|put you in the ground)\b/i;
  const phonePattern = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/;
  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const addressPattern = /\b\d{2,5}\s+[a-z0-9.\- ]+\s(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr|boulevard|blvd)\b/i;
  const urlPattern = /(https?:\/\/|www\.)\S+/gi;
  const spamPattern = /\b(free money|crypto giveaway|cashapp me|telegram me|whatsapp me|click this)\b/i;
  const offPlatformPattern =
    /\b(dm me|snap me|message me privately|hit me up privately|text me privately|add me on snap|take this off app)\b/i;
  const explicitPattern =
    /\b(send nudes|show me nudes|explicit pics|onlyfans|hook up tonight|sexual content for cash)\b/i;
  const junkPattern = /(.)\1{7,}/;

  const urlMatches = value.match(urlPattern) || [];
  const repeatedUrlSpam = urlMatches.length > 1;

  if (
    threatPattern.test(normalized) ||
    phonePattern.test(value) ||
    emailPattern.test(value) ||
    addressPattern.test(normalized) ||
    spamPattern.test(normalized) ||
    repeatedUrlSpam ||
    junkPattern.test(normalized) ||
    explicitPattern.test(normalized)
  ) {
    return false;
  }

  if (!isAdult && offPlatformPattern.test(normalized)) {
    return false;
  }

  if (offPlatformPattern.test(normalized)) {
    return false;
  }

  return true;
}

export default function AppShellPage({ initialHasAccess = false }) {
  const [posts, setPosts] = useState(seededPosts);
  const [hasEnteredApp, setHasEnteredApp] = useState(initialHasAccess);
  const [isAuthInitializing, setIsAuthInitializing] = useState(initialHasAccess);
  const [currentView, setCurrentView] = useState("feed");
  const [selectedProfileUsername, setSelectedProfileUsername] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [votedPosts, setVotedPosts] = useState({});
  const [comments, setComments] = useState(seededComments);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [commentReportReasons, setCommentReportReasons] = useState({});
  const [boostMenuPostId, setBoostMenuPostId] = useState(null);
  const [shareFeedback, setShareFeedback] = useState({});
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [shareSheetView, setShareSheetView] = useState("primary");
  const [pendingVotes, setPendingVotes] = useState({});
  const [voteErrors, setVoteErrors] = useState({});
  const [selectedMembershipId, setSelectedMembershipId] = useState("free");
  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [authMode, setAuthMode] = useState("signup");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthPasswordVisible, setIsAuthPasswordVisible] = useState(false);
  const [signupCaptchaToken, setSignupCaptchaToken] = useState("");
  const [signupCaptchaResetCount, setSignupCaptchaResetCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(emptyAuthenticatedUserProfile);
  const [safetyProfile, setSafetyProfile] = useState({
    birthdate: "",
    isAdult: null,
  });
  const [draft, setDraft] = useState({
    image: "",
    category: "Cars",
    caption: "",
    story: "",
    confirmSafe: false,
  });
  const [draftImageName, setDraftImageName] = useState("");
  const [profileDraft, setProfileDraft] = useState(emptyAuthenticatedUserProfile);
  const [profileImageName, setProfileImageName] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [postSafetyError, setPostSafetyError] = useState("");
  const [postLimitError, setPostLimitError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const categoryMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const profileImageInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraCanvasRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const profileIdCacheRef = useRef({});

  const profiles = useMemo(() => {
    const grouped = posts.reduce((accumulator, post) => {
      if (!accumulator[post.username]) {
        const profile = post.owner
          ? currentUserProfile
          : profileDirectory[post.username] ||
            (isFounderUsername(post.username)
              ? demoCurrentUserProfile
              : {
                  avatar: DEFAULT_PROFILE_AVATAR,
                  location: "",
                  bio: "",
                });
        accumulator[post.username] = {
          username: post.username,
          displayName: post.owner ? currentUserProfile.displayName : post.displayName,
          badge: post.owner ? currentUserProfile.badge : post.badge,
          avatar: profile.avatar,
          location: profile.location,
          bio: profile.bio || "",
          posts: [],
        };
      }

      accumulator[post.username].posts.push(post);
      return accumulator;
    }, {});

    if (!grouped[currentUserProfile.username]) {
      grouped[currentUserProfile.username] = {
        ...currentUserProfile,
        posts: [],
      };
    }

    return Object.values(grouped)
      .map((entry) => ({
        ...entry,
        totalPosts: entry.posts.length,
        averageScore:
          entry.posts.reduce((sum, post) => sum + post.score, 0) / entry.posts.length,
        wouldFlexAverage:
          entry.posts.reduce((sum, post) => sum + post.wouldFlexPercent, 0) / entry.posts.length,
        fakeAiAverage:
          entry.posts.reduce((sum, post) => sum + post.fakeAiPercent, 0) / entry.posts.length,
      }))
      .sort((left, right) => right.averageScore - left.averageScore);
  }, [currentUserProfile, posts]);

  const currentUser =
    profiles.find((profile) => profile.username === currentUserProfile.username) || {
      ...currentUserProfile,
      totalPosts: 0,
      averageScore: 0,
      wouldFlexAverage: 0,
      fakeAiAverage: 0,
      posts: [],
    };

  const effectiveMembershipId = isFounderIdentity(currentUserProfile)
    ? "elite"
    : selectedMembershipId;
  const selectedMembership =
    membershipTiers.find((tier) => tier.id === effectiveMembershipId) || membershipTiers[0];
  const profileUpgradeLabel =
    isFounderIdentity(currentUserProfile)
      ? "Founder Elite"
      : effectiveMembershipId === "premium"
      ? "Upgrade to Elite"
      : effectiveMembershipId === "elite"
        ? "Elite Active"
        : "Upgrade Status";

  const selectedProfile =
    profiles.find((profile) => profile.username === selectedProfileUsername) || currentUser;
  const selectedProfileTopFlex =
    selectedProfile.posts.length > 0
      ? [...selectedProfile.posts].sort((left, right) => right.score - left.score)[0]
      : null;
  const isOwnProfile = selectedProfile.username === currentUser.username;
  const isFounderProfile = isFounderIdentity(selectedProfile);
  const isFollowingSelectedProfile = currentUserFollowing.includes(selectedProfile.username);
  const selectedProfileFollowers =
    getSeededSocialCount(selectedProfile.username, 1240, 6200) +
    (isFollowingSelectedProfile && !isOwnProfile ? 1 : 0);
  const selectedProfileFollowing = isOwnProfile
    ? getSeededSocialCount(selectedProfile.username, 140, 780) + currentUserFollowing.length
    : getSeededSocialCount(selectedProfile.username, 140, 780);
  const leaderboardPreview = profiles.slice(0, 5);
  const currentUserPostCount = posts.filter((post) =>
    currentUserProfile.id ? post.userId === currentUserProfile.id : post.username === currentUser.username
  ).length;
  const sortedFeedPosts = useMemo(() => {
    return [...posts].sort((left, right) => {
      const leftBoosted = left.boosted ? 1 : 0;
      const rightBoosted = right.boosted ? 1 : 0;

      if (leftBoosted !== rightBoosted) {
        return rightBoosted - leftBoosted;
      }

      const leftBoostPriority = boostPriority[left.boostLevel] || 0;
      const rightBoostPriority = boostPriority[right.boostLevel] || 0;
      if (leftBoostPriority !== rightBoostPriority) {
        return rightBoostPriority - leftBoostPriority;
      }

      const leftBoostedAt = new Date(left.boostedAt || left.createdAt || 0).getTime();
      const rightBoostedAt = new Date(right.boostedAt || right.createdAt || 0).getTime();
      if (leftBoostedAt !== rightBoostedAt) {
        return rightBoostedAt - leftBoostedAt;
      }

      return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
    });
  }, [posts]);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return profiles
      .filter((profile) => {
        const profileMatch =
          profile.username.toLowerCase().includes(query) ||
          profile.displayName.toLowerCase().includes(query);
        const captionMatch = profile.posts.some((post) => post.caption.toLowerCase().includes(query));

        return profileMatch || captionMatch;
      })
      .slice(0, 6);
  }, [profiles, searchQuery]);
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (left, right) =>
        new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
    );
  }, [notifications]);
  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;
  const supabaseReady = canUseSupabaseAuth();
  const viewMeta = {
    feed: {
      eyebrow: "Main Feed",
      title: "Feed",
      copy: "Live PHLEXR flex posts with story-style leaderboard momentum at the top.",
    },
    post: {
      eyebrow: "Create",
      title: "Post",
      copy: "Upload locally, preview instantly, and push a new flex straight into your fake-data feed.",
    },
    profile: {
      eyebrow: "Profile",
      title: selectedProfile.displayName,
      copy: "Your profile, score presence, and post grid all stay connected to the same local shell state.",
    },
    "edit-profile": {
      eyebrow: "Profile Edit",
      title: "Edit profile",
      copy: "Refine your visible PHLEXR identity and keep it saved locally.",
    },
    membership: {
      eyebrow: "Membership",
      title: "Membership",
      copy: "Choose the PHLEXR tier that controls your visible status and local boost pricing.",
    },
    notifications: {
      eyebrow: "Activity",
      title: "Notifications",
      copy: "PHLEXR activity powered by follows, comments, votes, and boosts.",
    },
    leaderboard: {
      eyebrow: "Rankings",
      title: "Leaderboard",
      copy: "Top performers across the same local dataset powering the feed and profiles.",
    },
  };

  function buildOptimisticProfileFromAuthUser(authUser) {
    const metadata = authUser?.user_metadata || {};
    const fallbackUsername =
      metadata.username ||
      authUser?.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      `member${String(authUser?.id || "").slice(0, 6)}`;

    const optimisticProfile = {
      ...getProfileBase(true),
      id: authUser?.id || null,
      username: fallbackUsername,
      email: authUser?.email || "",
      displayName:
        metadata.display_name || metadata.username || fallbackUsername || "PHLEXR member",
      badge: isFounderIdentity({
        username: fallbackUsername,
        email: authUser?.email,
      })
        ? "Elite"
        : emptyAuthenticatedUserProfile.badge,
      isFounder: isFounderIdentity({
        username: fallbackUsername,
        email: authUser?.email,
      }),
    };

    return optimisticProfile;
  }

  async function hydrateCurrentUserFromSession(session) {
    const authUser = session?.user;
    if (!authUser) {
      return;
    }

    let profileRow = null;

    try {
      const { data, error } = await fetchProfileRow(authUser.id);
      profileRow = data || null;

      if ((!profileRow || error) && authUser.id) {
        const metadata = authUser.user_metadata || {};
        const fallbackUsername =
          metadata.username ||
          authUser.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
          `member${authUser.id.slice(0, 6)}`;
        const { data: upsertedProfile } = await updateProfileRow(authUser.id, {
          username: fallbackUsername,
          display_name:
            metadata.display_name || metadata.username || fallbackUsername,
          bio: "",
          location: "",
          avatar_url: "",
          membership_tier: isFounderIdentity({
            username: fallbackUsername,
            email: authUser.email,
          })
            ? "Elite"
            : "Free",
        });
        profileRow = upsertedProfile || null;
      }
    } catch {
      profileRow = null;
    }

    const metadata = authUser.user_metadata || {};
    const fallbackUsername =
      metadata.username ||
      authUser.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      `member${authUser.id.slice(0, 6)}`;
    const nextUsername = profileRow?.username || fallbackUsername;
    const membershipId = resolveMembershipIdForProfile({
      username: nextUsername,
      email: authUser.email,
      membershipTier: profileRow?.membership_tier,
      isFounder: profileRow?.is_founder,
    });
    const membershipBadge =
      membershipTiers.find((tier) => tier.id === membershipId)?.badge || emptyAuthenticatedUserProfile.badge;

    const nextProfile = {
      ...getProfileBase(true),
      id: authUser.id,
      username: nextUsername,
      email: authUser.email || "",
      displayName:
        profileRow?.display_name || metadata.display_name || metadata.username || fallbackUsername,
      bio: profileRow?.bio || "",
      location: profileRow?.location || "",
      avatar: profileRow?.avatar_url || emptyAuthenticatedUserProfile.avatar,
      badge: membershipBadge,
      isFounder: isFounderIdentity({
        username: nextUsername,
        email: authUser.email,
        isFounder: profileRow?.is_founder,
      }),
    };

    setSelectedMembershipId(membershipId);
    setCurrentUserProfile(nextProfile);
    setProfileDraft(nextProfile);
    setSelectedProfileUsername(nextProfile.username);
    setAuthForm((currentForm) => ({
      ...currentForm,
      username: nextProfile.username,
      email: authUser.email || currentForm.email,
      password: "",
    }));
  }

  function buildNotificationMessage(notification) {
    const actorName = notification.actorDisplayName || notification.actorUsername || "Someone";

    if (notification.type === "follow") {
      return `${actorName} followed you`;
    }

    if (notification.type === "comment") {
      return `${actorName} commented on your post`;
    }

    if (notification.type === "vote") {
      return `${actorName} rated your post`;
    }

    if (notification.type === "boost") {
      return `${actorName} boosted your post`;
    }

    return `${actorName} interacted with your account`;
  }

  function mapNotificationRow(notificationRow) {
    return {
      id: notificationRow.id,
      type: notificationRow.type,
      message: buildNotificationMessage({
        actorDisplayName: notificationRow.actor_display_name,
        actorUsername: notificationRow.actor_username,
        type: notificationRow.type,
      }),
      relatedUserId: notificationRow.actor_username || null,
      relatedPostId: notificationRow.post_id || null,
      relatedCommentId: notificationRow.comment_id || null,
      createdAt: notificationRow.created_at,
      read: notificationRow.read,
      actorDisplayName: notificationRow.actor_display_name || null,
      actorUsername: notificationRow.actor_username || null,
    };
  }

  function mapPostRow(postRow, userId) {
    return {
      id: postRow.id,
      userId: postRow.user_id,
      username: postRow.username,
      displayName: postRow.display_name,
      badge: normalizeStatus(postRow.badge),
      image: postRow.image_url,
      caption: postRow.caption,
      category: postRow.category,
      score: Number(postRow.score),
      wouldFlexPercent: postRow.would_flex_percent,
      fakeAiPercent: postRow.fake_ai_percent,
      createdAt: postRow.created_at,
      owner: postRow.user_id === userId,
      boosted: Boolean(postRow.boosted),
      boostLevel: postRow.boost_level,
      boostedAt: postRow.boosted_at,
    };
  }

  function mapCommentRow(commentRow) {
    return {
      id: commentRow.id,
      postId: commentRow.post_id,
      userId: commentRow.user_id,
      username: commentRow.username,
      displayName: commentRow.display_name,
      text: commentRow.text,
      createdAt: commentRow.created_at,
      isReported: Boolean(commentRow.is_reported),
      reportReason: commentRow.report_reason || undefined,
      hidden: Boolean(commentRow.hidden),
    };
  }

  async function loadNotifications(recipientUserId) {
    if (!supabaseReady || !recipientUserId) {
      setNotifications([]);
      return;
    }

    const { data, error } = await fetchNotifications(recipientUserId);

    if (error) {
      return;
    }

    setNotifications((data || []).map(mapNotificationRow));
  }

  async function resolveProfileIdByUsername(username) {
    if (!username) {
      return null;
    }

    if (profileIdCacheRef.current[username]) {
      return profileIdCacheRef.current[username];
    }

    if (username === currentUser.username && currentUserProfile.id) {
      profileIdCacheRef.current[username] = currentUserProfile.id;
      return currentUserProfile.id;
    }

    const { data } = await fetchProfileByUsername(username);
    const profileId = data?.id || null;

    if (profileId) {
      profileIdCacheRef.current[username] = profileId;
    }

    return profileId;
  }

  async function createRealtimeNotification({
    recipientUsername,
    type,
    postId = null,
    commentId = null,
  }) {
    if (!supabaseReady || !currentUserProfile.id) {
      return;
    }

    const recipientUserId = await resolveProfileIdByUsername(recipientUsername);

    if (!recipientUserId || recipientUserId === currentUserProfile.id) {
      return;
    }

    await createNotification({
      recipient_user_id: recipientUserId,
      actor_user_id: currentUserProfile.id,
      actor_username: currentUser.username,
      actor_display_name: currentUser.displayName,
      type,
      post_id: postId,
      comment_id: commentId,
    });
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryOpen(false);
      }

      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedSeedVersion = window.localStorage.getItem(SEED_VERSION_STORAGE_KEY);
      const shouldRefreshSeedData = savedSeedVersion !== APP_SHELL_SEED_VERSION;

      if (shouldRefreshSeedData) {
        window.localStorage.removeItem(POSTS_STORAGE_KEY);
        window.localStorage.removeItem(VOTED_POSTS_STORAGE_KEY);
        window.localStorage.removeItem(COMMENTS_STORAGE_KEY);
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      }

        const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
        let shouldUseDemoStorage = true;
        setCurrentUserProfile(emptyAuthenticatedUserProfile);
        setProfileDraft(emptyAuthenticatedUserProfile);
        setSelectedProfileUsername("");
        setSelectedMembershipId("free");
        setHasEnteredApp(false);

        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile?.id) {
          shouldUseDemoStorage = false;
          window.localStorage.removeItem(PROFILE_STORAGE_KEY);
          window.localStorage.removeItem(MEMBERSHIP_STORAGE_KEY);
          window.localStorage.removeItem(FOLLOWING_STORAGE_KEY);
          window.localStorage.removeItem(POSTS_STORAGE_KEY);
          window.localStorage.removeItem(COMMENTS_STORAGE_KEY);
          window.localStorage.removeItem(VOTED_POSTS_STORAGE_KEY);
        }
      }

      if (shouldUseDemoStorage) {
        const savedPosts = window.localStorage.getItem(POSTS_STORAGE_KEY);
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            setPosts(
              parsedPosts.map((post) => ({
                ...post,
                badge: normalizeStatus(post.badge),
              }))
            );
          }
        }

        const savedVotes = window.localStorage.getItem(VOTED_POSTS_STORAGE_KEY);
        if (savedVotes) {
          const parsedVotes = JSON.parse(savedVotes);
          if (parsedVotes && typeof parsedVotes === "object") {
            setVotedPosts(parsedVotes);
          }
        }

        const savedComments = window.localStorage.getItem(COMMENTS_STORAGE_KEY);
        if (savedComments) {
          const parsedComments = JSON.parse(savedComments);
          if (Array.isArray(parsedComments)) {
            setComments(parsedComments);
          }
        } else {
          setComments(seededComments);
        }
      } else {
        setPosts([]);
        setComments([]);
        setVotedPosts({});
        setCurrentUserFollowing([]);
      }

      const savedSafety = window.localStorage.getItem(SAFETY_STORAGE_KEY);
      if (savedSafety) {
        const parsedSafety = JSON.parse(savedSafety);
        if (parsedSafety && typeof parsedSafety === "object") {
          setSafetyProfile({
            birthdate: parsedSafety.birthdate || "",
            isAdult:
              typeof parsedSafety.isAdult === "boolean" ? parsedSafety.isAdult : deriveIsAdult(parsedSafety.birthdate),
          });
        }
      }

      const savedMembership = window.localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
        if (savedMembership && membershipTiers.some((tier) => tier.id === savedMembership)) {
          setSelectedMembershipId(savedMembership);
        }

      const savedFollowing = window.localStorage.getItem(FOLLOWING_STORAGE_KEY);
      if (shouldUseDemoStorage && savedFollowing) {
        const parsedFollowing = JSON.parse(savedFollowing);
        if (Array.isArray(parsedFollowing)) {
          setCurrentUserFollowing(parsedFollowing);
        }
      }

      window.localStorage.setItem(SEED_VERSION_STORAGE_KEY, APP_SHELL_SEED_VERSION);
    } catch {
      window.localStorage.removeItem(POSTS_STORAGE_KEY);
      window.localStorage.removeItem(VOTED_POSTS_STORAGE_KEY);
      window.localStorage.removeItem(COMMENTS_STORAGE_KEY);
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      window.localStorage.removeItem(SAFETY_STORAGE_KEY);
      window.localStorage.removeItem(MEMBERSHIP_STORAGE_KEY);
      window.localStorage.removeItem(FOLLOWING_STORAGE_KEY);
      window.localStorage.removeItem(SEED_VERSION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let active = true;

    async function handleConfirmedReturn() {
      const url = new URL(window.location.href);
      if (url.searchParams.get("confirmed") !== "1") {
        return;
      }

      await clearSupabaseBrowserSession();

      if (!active) {
        return;
      }

      setHasEnteredApp(false);
      setCurrentView("feed");
      setSelectedMembershipId("free");
      setSelectedProfileUsername("");
      setCurrentUserProfile(emptyAuthenticatedUserProfile);
      setProfileDraft(emptyAuthenticatedUserProfile);
      setAuthMode("signin");
      setAuthError("");
      setAuthMessage("Email confirmed. Sign in to enter PHLEXR.");
      url.searchParams.delete("confirmed");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }

    void handleConfirmedReturn();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    if (url.searchParams.get("signedout") !== "1") {
      return;
    }

    setAuthMode("signin");
    setAuthError("");
    setAuthMessage("Signed out.");
    url.searchParams.delete("signedout");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    if (!supabaseReady) {
      setHasEnteredApp(initialHasAccess);
      setIsAuthInitializing(false);
      return;
    }

    let isMounted = true;

    async function initializeAuth() {
      if (initialHasAccess) {
        setIsAuthInitializing(true);
      } else {
        setIsAuthInitializing(false);
      }
      try {
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          if (url.searchParams.get("confirmed") === "1") {
            await clearSupabaseBrowserSession();

            if (!isMounted) {
              return;
            }

            await resetToSignedOutState({ authMode: "signin" });
            setIsAuthInitializing(false);
            return;
          }
        }

        const { data: userData, error: userError } = await getCurrentSupabaseUser();

        if (!isMounted) {
          return;
        }

        if (userError) {
          setAuthError(userError.message);
        }

        if (!userData?.user) {
          await resetToSignedOutState({ authMode: "signin" });
          setIsAuthInitializing(false);
          return;
        }

        const { data, error } = await getCurrentSupabaseSession();

        if (!isMounted) {
          return;
        }

        if (error) {
          setAuthError(error.message);
        }

          if (data?.session) {
            await hydrateCurrentUserFromSession(data.session);
            if (!isMounted) {
              return;
            }
            setHasEnteredApp(initialHasAccess);
            setIsAuthInitializing(false);
          } else {
            await resetToSignedOutState({ authMode: "signin" });
            setIsAuthInitializing(false);
          }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        await resetToSignedOutState({ authMode: "signin" });
        setIsAuthInitializing(false);
        setAuthError(error instanceof Error ? error.message : "Unable to initialize auth.");
      }
    }

    initializeAuth();

      const {
        data: { subscription },
      } = subscribeToSupabaseAuthChanges(async (event, session) => {
        if (!isMounted) {
        return;
      }

        if (event === "INITIAL_SESSION") {
          return;
        }

        if (session) {
          const optimisticProfile = buildOptimisticProfileFromAuthUser(session.user);
          setCurrentUserProfile(optimisticProfile);
          setProfileDraft(optimisticProfile);
          setSelectedProfileUsername(optimisticProfile.username);
          setHasEnteredApp(initialHasAccess);
          setIsAuthInitializing(false);
          setAuthError("");
          void hydrateCurrentUserFromSession(session);
        } else {
          await resetToSignedOutState({ authMode: "signin" });
          setIsAuthInitializing(false);
        }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [initialHasAccess, supabaseReady]);

  useEffect(() => {
    if (!supabaseReady || !currentUserProfile.id) {
      setNotifications([]);
      return;
    }

    let active = true;
    loadNotifications(currentUserProfile.id);

    const subscription = subscribeToNotifications(currentUserProfile.id, async () => {
      if (!active) {
        return;
      }

      await loadNotifications(currentUserProfile.id);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [currentUserProfile.id, supabaseReady]);

  useEffect(() => {
    if (!supabaseReady || !currentUserProfile.id) {
      return;
    }

    let active = true;

    async function loadAuthenticatedAppState() {
      const [{ data: postRows, error: postsError }, { data: followingRows }, { data: voteRows }] =
        await Promise.all([
          fetchFeedPosts(),
          fetchFollowingRows(currentUserProfile.id),
          fetchVoteRows(currentUserProfile.id),
        ]);

      if (!active || postsError) {
        return;
      }

      const mappedPosts = (postRows || []).map((postRow) => mapPostRow(postRow, currentUserProfile.id));
      const postIds = mappedPosts.map((post) => post.id);
      const { data: commentRows } = await fetchCommentsForPosts(postIds);

      if (!active) {
        return;
      }

      setPosts(mappedPosts);
      setComments((commentRows || []).map(mapCommentRow));
      setCurrentUserFollowing((followingRows || []).map((row) => row.following_username));
      setVotedPosts(
        (voteRows || []).reduce((accumulator, voteRow) => {
          accumulator[voteRow.post_id] = voteRow.vote_type;
          return accumulator;
        }, {})
      );
    }

    loadAuthenticatedAppState();

    return () => {
      active = false;
    };
  }, [currentUserProfile.id, supabaseReady]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      return;
    }

    window.localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [currentUserProfile.id, posts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      return;
    }

    window.localStorage.setItem(VOTED_POSTS_STORAGE_KEY, JSON.stringify(votedPosts));
  }, [currentUserProfile.id, votedPosts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      return;
    }

    window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [currentUserProfile.id, comments]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      setProfileDraft(currentUserProfile);
      return;
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(currentUserProfile));
    setProfileDraft(currentUserProfile);
  }, [currentUserProfile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(safetyProfile));
  }, [safetyProfile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      return;
    }

    if (isFounderIdentity(currentUserProfile)) {
      window.localStorage.setItem(MEMBERSHIP_STORAGE_KEY, "elite");
      return;
    }

    window.localStorage.setItem(MEMBERSHIP_STORAGE_KEY, selectedMembershipId);
  }, [currentUserProfile.username, selectedMembershipId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserProfile.id) {
      return;
    }

    window.localStorage.setItem(FOLLOWING_STORAGE_KEY, JSON.stringify(currentUserFollowing));
  }, [currentUserFollowing, currentUserProfile.id]);

  useEffect(() => {
    if (isFounderIdentity(currentUserProfile) && selectedMembershipId !== "elite") {
      setSelectedMembershipId("elite");
      return;
    }

    setCurrentUserProfile((currentProfile) => ({
      ...currentProfile,
      badge: isFounderIdentity(currentProfile) ? "Elite" : selectedMembership.badge,
    }));
  }, [selectedMembership.badge]);

  useEffect(() => {
    setPosts((currentPosts) => {
      let changed = false;

      const nextPosts = currentPosts.map((post) => {
        if (!post.owner) {
          return post;
        }

        if (
          post.username === currentUserProfile.username &&
          post.displayName === currentUserProfile.displayName &&
          post.badge === currentUserProfile.badge
        ) {
          return post;
        }

        changed = true;
        return {
          ...post,
          username: currentUserProfile.username,
          displayName: currentUserProfile.displayName,
          badge: currentUserProfile.badge,
        };
      });

      return changed ? nextPosts : currentPosts;
    });
  }, [currentUserProfile.badge, currentUserProfile.displayName, currentUserProfile.username]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasEnteredApp) {
      return;
    }

    window.location.hash = currentView;
  }, [currentView, hasEnteredApp]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("mousedown", handlePointerDown);
      window.addEventListener("touchstart", handlePointerDown);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousedown", handlePointerDown);
        window.removeEventListener("touchstart", handlePointerDown);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCameraOpen || !cameraVideoRef.current || !cameraStreamRef.current) {
      return;
    }

    const videoElement = cameraVideoRef.current;
    videoElement.srcObject = cameraStreamRef.current;
    videoElement.play().catch(() => {});

    return () => {
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, []);

  function enterShell(targetId = "feed") {
    setHasEnteredApp(true);
    setCurrentView(targetId);
  }

  function openProfile(username) {
    setHasEnteredApp(true);
    setSelectedProfileUsername(username);
    setCurrentView("profile");
    setSearchQuery("");
    setIsSearchOpen(false);
  }

  function openLeaderboard() {
    setHasEnteredApp(true);
    setCurrentView("leaderboard");
  }

  function normalizeLoggedOutRoute() {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.pathname === "/feed") {
      window.history.replaceState({}, "", "/app-shell");
    }
  }

  async function resetToSignedOutState({ clearBrowserSession = false, authMode = "signup" } = {}) {
    if (clearBrowserSession) {
      await clearSupabaseBrowserSession();
    }

    setHasEnteredApp(false);
    setCurrentView("feed");
    setSelectedMembershipId("free");
    setSelectedProfileUsername("");
    setCurrentUserProfile(emptyAuthenticatedUserProfile);
    setProfileDraft(emptyAuthenticatedUserProfile);
    setAuthMode(authMode);
    normalizeLoggedOutRoute();
  }

  async function handleMarkNotificationRead(notificationId) {
    if (!supabaseReady || !currentUserProfile.id) {
      return;
    }

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );

    await markNotificationAsRead(notificationId);
  }

  async function handleMarkAllNotificationsRead() {
    if (!supabaseReady || !currentUserProfile.id) {
      return;
    }

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, read: true }))
    );

    await markAllNotificationsAsRead(currentUserProfile.id);
  }

  async function handleNotificationOpen(notification) {
    await handleMarkNotificationRead(notification.id);

    if (notification.relatedUserId) {
      openProfile(notification.relatedUserId);
      return;
    }

    navigateTo("feed");
  }

  async function handleToggleFollow(username) {
    if (username === currentUser.username) {
      return;
    }

    if (currentUserProfile.id) {
      const targetProfileId = await resolveProfileIdByUsername(username);

      if (!targetProfileId) {
        return;
      }

      const isAlreadyFollowing = currentUserFollowing.includes(username);

      if (isAlreadyFollowing) {
        await deleteFollowRow(currentUserProfile.id, targetProfileId);
        setCurrentUserFollowing((currentFollowing) =>
          currentFollowing.filter((entry) => entry !== username)
        );
        return;
      }

      const { error } = await createFollowRow({
        follower_user_id: currentUserProfile.id,
        follower_username: currentUser.username,
        following_user_id: targetProfileId,
        following_username: username,
      });

      if (error) {
        return;
      }

      setCurrentUserFollowing((currentFollowing) => [...currentFollowing, username]);
      await createRealtimeNotification({
        recipientUsername: username,
        type: "follow",
      });
      return;
    }

    setCurrentUserFollowing((currentFollowing) => {
      if (currentFollowing.includes(username)) {
        return currentFollowing.filter((entry) => entry !== username);
      }

      return [...currentFollowing, username];
    });
  }

  function navigateTo(view) {
    setHasEnteredApp(true);
    setCurrentView(view);
  }

  function setTimedShareFeedback(postId, message) {
    setShareFeedback((currentFeedback) => ({
      ...currentFeedback,
      [postId]: message,
    }));

    window.setTimeout(() => {
      setShareFeedback((currentFeedback) => {
        const nextFeedback = { ...currentFeedback };
        delete nextFeedback[postId];
        return nextFeedback;
      });
    }, 2400);
  }

  async function handleVote(postId, voteType) {
    if (pendingVotes[postId]) {
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) {
      return;
    }

    const previousVote = votedPosts[postId];
    if (previousVote === voteType) {
      return;
    }

    setVoteErrors((currentErrors) => ({
      ...currentErrors,
      [postId]: "",
    }));

    triggerVoteHaptic(voteType);

    const adjustments = {
      flex: { score: 0.12, wouldFlexPercent: 3, fakeAiPercent: -1 },
      notIt: { score: -0.18, wouldFlexPercent: -4, fakeAiPercent: 1 },
      fakeAi: { score: -0.26, wouldFlexPercent: -6, fakeAiPercent: 4 },
    };
    const previousChange = previousVote
      ? adjustments[previousVote]
      : { score: 0, wouldFlexPercent: 0, fakeAiPercent: 0 };
    const nextChange = adjustments[voteType];
    const change = {
      score: nextChange.score - previousChange.score,
      wouldFlexPercent: nextChange.wouldFlexPercent - previousChange.wouldFlexPercent,
      fakeAiPercent: nextChange.fakeAiPercent - previousChange.fakeAiPercent,
    };

    setPendingVotes((currentPendingVotes) => ({
      ...currentPendingVotes,
      [postId]: true,
    }));

    try {
      if (currentUserProfile.id) {
        const { data: updatedPostRows, error: voteError } = await castPostVote(postId, voteType);

        if (voteError) {
          setVoteErrors((currentErrors) => ({
            ...currentErrors,
            [postId]: voteError.message || "Vote failed. Try again.",
          }));
          return;
        }

        const updatedPost = Array.isArray(updatedPostRows) ? updatedPostRows[0] : updatedPostRows;

        setVotedPosts((currentVotes) => ({
          ...currentVotes,
          [postId]: voteType,
        }));

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? updatedPost
                ? mapPostRow(updatedPost, currentUserProfile.id)
                : applyVoteChangeToPost(post, change)
              : post
          )
        );

        if (!previousVote && targetPost.username && targetPost.username !== currentUser.username) {
          await createRealtimeNotification({
            recipientUsername: targetPost.username,
            type: "vote",
            postId,
          });
        }
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          return applyVoteChangeToPost(post, change);
        })
      );
      setVotedPosts((currentVotes) => ({
        ...currentVotes,
        [postId]: voteType,
      }));
    } finally {
      setPendingVotes((currentPendingVotes) => {
        const nextPendingVotes = { ...currentPendingVotes };
        delete nextPendingVotes[postId];
        return nextPendingVotes;
      });
    }
  }

  function handleBirthdateChange(event) {
    const birthdate = formatBirthdateInput(event.target.value);
    setSafetyProfile({
      birthdate,
      isAdult: deriveIsAdult(birthdate),
    });
  }

  function handleCommentDraftChange(postId, value) {
    setCommentDrafts((currentDrafts) => ({
      ...currentDrafts,
      [postId]: value,
    }));
    setCommentErrors((currentErrors) => ({
      ...currentErrors,
      [postId]: "",
    }));
  }

  function handleAuthFieldChange(field, value) {
    setAuthForm((currentForm) => ({
      ...currentForm,
      [field]: field === "username" ? value.toLowerCase().replace(/\s+/g, "") : value,
    }));
    setAuthError("");
    setAuthMessage("");
  }

  async function handleCreateAccount() {
    const username = authForm.username.trim().toLowerCase();
    const email = authForm.email.trim();
    const password = authForm.password;

    if (!username || !email || !password) {
      setAuthError("Username, email, and password are required.");
      return;
    }

    if (!supabaseReady) {
      setAuthError("Supabase keys are missing.");
      return;
    }

    if (!canUseTurnstile()) {
      setAuthError("Verification is unavailable right now.");
      return;
    }

    if (!signupCaptchaToken) {
      setAuthError("Complete verification to create your account.");
      return;
    }

    setAuthLoading(true);
    setAuthMode("signup");
    setAuthError("");
    setAuthMessage("");

    try {
      await verifyCaptchaToken(signupCaptchaToken);
    } catch (error) {
      setAuthLoading(false);
      setSignupCaptchaToken("");
      setSignupCaptchaResetCount((count) => count + 1);
      setAuthError(error instanceof Error ? error.message : "Verification failed. Try again.");
      return;
    }

    const { data, error } = await signUpWithEmail({
      email,
      password,
      username,
      displayName: username,
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    });

    if (error) {
      setAuthLoading(false);
      setSignupCaptchaToken("");
      setSignupCaptchaResetCount((count) => count + 1);
      setAuthError(error.message);
      return;
    }

    if (data?.session) {
      await hydrateCurrentUserFromSession(data.session);
      setHasEnteredApp(true);
      setCurrentView("feed");
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);
    setSignupCaptchaToken("");
    setSignupCaptchaResetCount((count) => count + 1);
    setAuthMode("check-email");
    setAuthMessage("We sent you a confirmation link to finish creating your account.");
  }

  async function handleSignIn() {
    const email = authForm.email.trim();
    const password = authForm.password;

    if (!email || !password) {
      setAuthError("Email and password are required.");
      return;
    }

    if (!supabaseReady) {
      setAuthError("Supabase keys are missing.");
      return;
    }

    setAuthLoading(true);
    setAuthMode("signin");
    setAuthError("");
    setAuthMessage("");

    try {
      const { data, error } = await signInWithEmail({
        email,
        password,
      });

      if (error) {
        setAuthError(
          error.message.toLowerCase().includes("invalid login credentials")
            ? "Invalid email or password. If you just created your account, confirm your email first or reset your password."
            : error.message
        );
        return;
      }

      if (!data?.session) {
        setAuthError("Unable to start your session. Try again.");
        return;
      }

      const optimisticProfile = buildOptimisticProfileFromAuthUser(data.session.user);
      setCurrentView("feed");
      setCurrentUserProfile(optimisticProfile);
      setProfileDraft(optimisticProfile);
      setSelectedProfileUsername(optimisticProfile.username);
      setHasEnteredApp(true);
      void hydrateCurrentUserFromSession(data.session);

      if (typeof window !== "undefined" && window.location.pathname !== "/feed") {
        window.history.replaceState({}, "", "/feed");
      }

    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign in right now.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    const { error } = await signOutFromSupabase();

    if (error) {
      setAuthLoading(false);
      setAuthError(error.message);
      return;
    }

    setHasEnteredApp(false);
    setCurrentView("feed");
    setSelectedMembershipId("free");
    setSelectedProfileUsername("");
    setCurrentUserProfile(emptyAuthenticatedUserProfile);
    setProfileDraft(emptyAuthenticatedUserProfile);
    setAuthForm((currentForm) => ({
      ...currentForm,
      password: "",
    }));

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      window.localStorage.removeItem(MEMBERSHIP_STORAGE_KEY);
      window.localStorage.removeItem(FOLLOWING_STORAGE_KEY);
      window.localStorage.removeItem(POSTS_STORAGE_KEY);
      window.localStorage.removeItem(COMMENTS_STORAGE_KEY);
      window.localStorage.removeItem(VOTED_POSTS_STORAGE_KEY);
      window.history.replaceState({}, "", "/app-shell?signedout=1");
    }

    setAuthMode("signin");
    setAuthMessage("Signed out.");
    setAuthLoading(false);

    if (typeof window !== "undefined") {
      window.location.assign("/auth/signout");
    }
  }

  async function handleAddComment(postId) {
    const nextText = (commentDrafts[postId] || "").trim();
    if (!nextText) {
      return;
    }

    if (!moderateComment(nextText, safetyProfile.isAdult)) {
      setCommentErrors((currentErrors) => ({
        ...currentErrors,
        [postId]: "Comment not allowed.",
      }));
      return;
    }

    let newComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUserProfile.id || null,
      username: currentUser.username,
      displayName: currentUser.displayName,
      text: nextText,
      createdAt: new Date().toISOString(),
      isReported: false,
      hidden: false,
    };

    if (currentUserProfile.id) {
      const { data, error } = await createCommentRow({
        post_id: postId,
        user_id: currentUserProfile.id,
        username: currentUser.username,
        display_name: currentUser.displayName,
        text: nextText,
      });

      if (error || !data) {
        return;
      }

      newComment = mapCommentRow(data);
    }

    setComments((currentComments) => [...currentComments, newComment]);
    setCommentDrafts((currentDrafts) => ({
      ...currentDrafts,
      [postId]: "",
    }));
    setCommentErrors((currentErrors) => ({
      ...currentErrors,
      [postId]: "",
    }));

    const targetPost = posts.find((post) => post.id === postId);
    if (targetPost?.username && targetPost.username !== currentUser.username) {
      await createRealtimeNotification({
        recipientUsername: targetPost.username,
        type: "comment",
        postId,
        commentId: newComment.id,
      });
    }
  }

  function handleDeleteComment(commentId) {
    if (currentUserProfile.id) {
      deleteCommentRow(commentId);
    }

    setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
  }

  function handleReportComment(commentId) {
    const reason = commentReportReasons[commentId] || "Other";

    if (currentUserProfile.id) {
      reportCommentRow(commentId, reason);
    }

    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isReported: true,
              reportReason: reason,
            }
          : comment
      )
    );
  }

  function handleImageUrlChange(event) {
    setCameraError("");
    setDraftImageName("");
    setDraft((currentDraft) => ({
      ...currentDraft,
      image: event.target.value,
    }));
  }

  function applyDraftImage(result, imageName) {
    setCameraError("");
    setDraft((currentDraft) => ({
      ...currentDraft,
      image: result,
    }));
    setDraftImageName(imageName);
  }

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      applyDraftImage(result, selectedFile.name);
    };
    reader.readAsDataURL(selectedFile);
  }

  function isMobileCameraDevice() {
    if (typeof navigator === "undefined") {
      return false;
    }

    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  }

  function closeCameraCapture() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    if (cameraVideoRef.current?.srcObject) {
      cameraVideoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  }

  async function handleOpenCamera() {
    setCameraError("");

    if (isMobileCameraDevice() && cameraInputRef.current) {
      cameraInputRef.current.click();
      return;
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera unavailable on this device. Use upload from device instead.");
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setCameraError("Camera access was denied or unavailable. Use upload from device instead.");
    }
  }

  function handleCaptureFromCamera() {
    if (!cameraVideoRef.current || !cameraCanvasRef.current) {
      setCameraError("Camera capture is unavailable right now.");
      return;
    }

    const videoElement = cameraVideoRef.current;
    const canvasElement = cameraCanvasRef.current;
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    if (!width || !height) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    canvasElement.width = width;
    canvasElement.height = height;
    const context = canvasElement.getContext("2d");

    if (!context) {
      setCameraError("Camera capture is unavailable right now.");
      return;
    }

    context.drawImage(videoElement, 0, 0, width, height);
    applyDraftImage(canvasElement.toDataURL("image/jpeg", 0.92), "Camera capture");
    closeCameraCapture();
  }

  function handleProfileImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfileDraft((currentDraft) => ({
        ...currentDraft,
        avatar: result,
      }));
      setProfileImageName(selectedFile.name);
      setProfileSaveError("");
      setProfileSaveMessage("");
    };
    reader.readAsDataURL(selectedFile);
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setProfileSaveError("");
    setProfileSaveMessage("");

    if (!currentUserProfile.id) {
      setProfileSaveError("Your account is still syncing. Try saving again in a moment.");
      return;
    }

    setIsProfileSaving(true);
    const nextProfile = {
      ...currentUserProfile,
      ...profileDraft,
      username: profileDraft.username.trim() || currentUserProfile.username,
      displayName: profileDraft.displayName.trim() || currentUserProfile.displayName,
      bio: profileDraft.bio.trim(),
      location: profileDraft.location.trim() || currentUserProfile.location,
      avatar: profileDraft.avatar.trim() || currentUserProfile.avatar,
    };

    const previousUsername = currentUserProfile.username;

    try {
      const { data, error } = await updateProfileRow(currentUserProfile.id, {
        username: nextProfile.username,
        display_name: nextProfile.displayName,
        bio: nextProfile.bio,
        location: nextProfile.location,
        avatar_url: nextProfile.avatar,
        membership_tier: isFounderIdentity(currentUserProfile) ? "Elite" : selectedMembership.name,
      });

      if (error || !data) {
        setProfileSaveError(error?.message || "Profile save failed. Try again.");
        return;
      }

      nextProfile.username = data.username;
      nextProfile.displayName = data.display_name;
      nextProfile.bio = data.bio || "";
      nextProfile.location = data.location || "";
      nextProfile.avatar = data.avatar_url || DEFAULT_PROFILE_AVATAR;
      nextProfile.email = currentUserProfile.email;
      nextProfile.isFounder = Boolean(data.is_founder);
      nextProfile.badge = isFounderIdentity({
        username: data.username,
        email: currentUserProfile.email,
        isFounder: data.is_founder,
      })
        ? "Elite"
        : normalizeStatus(data.membership_tier);

      setCurrentUserProfile(nextProfile);
      setProfileDraft(nextProfile);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.owner
            ? {
                ...post,
                username: nextProfile.username,
                displayName: nextProfile.displayName,
                badge: nextProfile.badge,
              }
            : post
        )
      );
      setSelectedProfileUsername((currentUsername) =>
        currentUsername === previousUsername ? nextProfile.username : currentUsername
      );
      setProfileSaveMessage("Profile saved.");
      setCurrentView("profile");
    } finally {
      setIsProfileSaving(false);
    }
  }

  function startEditingPost(post) {
    setEditingPostId(post.id);
    setDraft({
      image: post.image,
      category: post.category,
      caption: post.caption,
      story: "",
      confirmSafe: true,
    });
    setDraftImageName(post.image.startsWith("data:") ? "Current uploaded image" : "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCurrentView("post");
  }

  async function handleDeletePost(postId) {
    if (currentUserProfile.id) {
      await deletePostRow(postId);
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setComments((currentComments) => currentComments.filter((comment) => comment.postId !== postId));
    setVotedPosts((currentVotes) => {
      const nextVotes = { ...currentVotes };
      delete nextVotes[postId];
      return nextVotes;
    });
    if (editingPostId === postId) {
      setEditingPostId(null);
      setDraft({
        image: "",
        category: currentUser.posts[0]?.category || "Cars",
        caption: "",
        story: "",
        confirmSafe: false,
      });
      setDraftImageName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    if (boostMenuPostId === postId) {
      setBoostMenuPostId(null);
    }
  }

  function toggleBoostMenu(postId) {
    setBoostMenuPostId((currentPostId) => (currentPostId === postId ? null : postId));
  }

  async function handleBoostSelect(postId, boostLevel) {
    if (currentUserProfile.id) {
      const { data } = await updatePostRow(postId, {
        boosted: true,
        boost_level: boostLevel,
        boosted_at: new Date().toISOString(),
      });

      if (data) {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId ? mapPostRow(data, currentUserProfile.id) : post
          )
        );
      }
    } else {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              boosted: true,
              boostLevel,
              boostedAt: new Date().toISOString(),
            }
          : post
      )
    );
    }
    addNotification({
      type: "boost",
      message: `Your post was boosted for ${boostLevel}`,
      relatedUserId: currentUser.username,
      relatedPostId: postId,
    });
    setBoostMenuPostId(null);
  }

  async function handleSharePost(post) {
    setActiveSharePostId(post.id);
    setShareSheetView("primary");
    return;

    const shareUrl = `https://phlexr.com/app-shell?post=${post.id}`;
    const sharePayload = {
      title: "PHLEXR",
      text: `${post.displayName} · ${post.caption || "PHLEXR post"}`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(sharePayload);
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        throw new Error("Sharing is not available.");
      }

      setShareFeedback((currentFeedback) => ({
        ...currentFeedback,
        [post.id]: "Link ready",
      }));
      window.setTimeout(() => {
        setShareFeedback((currentFeedback) => {
          const nextFeedback = { ...currentFeedback };
          delete nextFeedback[post.id];
          return nextFeedback;
        });
      }, 2400);
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      setShareFeedback((currentFeedback) => ({
        ...currentFeedback,
        [post.id]: "Share unavailable",
      }));
      window.setTimeout(() => {
        setShareFeedback((currentFeedback) => {
          const nextFeedback = { ...currentFeedback };
          delete nextFeedback[post.id];
          return nextFeedback;
        });
      }, 2400);
    }
  }

  function closeShareSheet() {
    setActiveSharePostId(null);
    setShareSheetView("primary");
  }

  function canShowTextShareOption() {
    if (typeof navigator === "undefined") {
      return false;
    }

    const userAgent = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) || navigator.maxTouchPoints > 0;
  }

  async function copyShareLinkSilently(shareUrl) {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch {
      return false;
    }
  }

  async function handleCopyShareLink() {
    const activeSharePost = posts.find((post) => post.id === activeSharePostId);

    if (!activeSharePost) {
      return;
    }

    const shareUrl = `https://phlexr.com/app-shell?post=${activeSharePost.id}`;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setTimedShareFeedback(activeSharePost.id, "Link copied");
      } else {
        throw new Error("Copy unavailable");
      }
    } catch {
      setTimedShareFeedback(activeSharePost.id, "Copy unavailable");
    }

    closeShareSheet();
  }

  async function handleNativeShare() {
    const activeSharePost = posts.find((post) => post.id === activeSharePostId);

    if (
      !activeSharePost ||
      typeof navigator === "undefined" ||
      typeof navigator.share !== "function"
    ) {
      return;
    }

    const sharePayload = {
      title: "PHLEXR",
      text: `${activeSharePost.displayName} · ${activeSharePost.caption || "PHLEXR post"}`,
      url: `https://phlexr.com/app-shell?post=${activeSharePost.id}`,
    };

    try {
      await navigator.share(sharePayload);
      setTimedShareFeedback(activeSharePost.id, "Shared");
      closeShareSheet();
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      setTimedShareFeedback(activeSharePost.id, "Share unavailable");
      closeShareSheet();
    }
  }

  function openMoreShareSheet() {
    setShareSheetView("more");
  }

  function openPrimaryShareSheet() {
    setShareSheetView("primary");
  }

  async function handleExternalShare(destination) {
    const activeSharePost = posts.find((post) => post.id === activeSharePostId);

    if (!activeSharePost || typeof window === "undefined") {
      return;
    }

    const shareUrl = `https://phlexr.com/app-shell?post=${activeSharePost.id}`;
    const shareText = `${activeSharePost.displayName} · ${activeSharePost.caption || "PHLEXR post"}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const copiedForDestination = await copyShareLinkSilently(shareUrl);
    const isMobileDevice = canShowTextShareOption();
    const shareDestinations = {
      text: `sms:?&body=${encodedText}%0A%0A${encodedUrl}`,
      messenger: isMobileDevice
        ? `fb-messenger://share/?link=${encodedUrl}`
        : "https://www.messenger.com/",
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      instagram: "https://www.instagram.com/",
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent("PHLEXR post")}&body=${encodedText}%0A%0A${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent("PHLEXR post")}&body=${encodedText}%0A%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      snapchat: "https://www.snapchat.com/",
      drive: "https://drive.google.com/drive/my-drive",
      discord: "https://discord.com/channels/@me",
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    };

    const destinationUrl = shareDestinations[destination];

    if (!destinationUrl) {
      return;
    }

    window.open(destinationUrl, "_blank", "noopener,noreferrer");
    setTimedShareFeedback(
      activeSharePost.id,
      copiedForDestination &&
        ["instagram", "messenger", "snapchat", "drive", "discord"].includes(destination)
        ? "Link copied and share opened"
        : "Share ready"
    );
    closeShareSheet();
  }

  async function handlePostSubmit(event) {
    event.preventDefault();
    setHasEnteredApp(true);
    setPostLimitError("");

    if (!draft.image) {
      return;
    }

    if (!draft.confirmSafe) {
      setPostSafetyError("Please confirm the image contains no nudity or explicit content.");
      return;
    }

    if (!editingPostId && selectedMembershipId === "free" && currentUserPostCount >= 2) {
      setPostLimitError("Free accounts can post up to 2 times. Upgrade to post more.");
      return;
    }

    if (editingPostId) {
      if (currentUserProfile.id) {
        const { data } = await updatePostRow(editingPostId, {
          image_url: draft.image,
          caption: draft.caption,
          category: draft.category,
        });

        if (data) {
          setPosts((currentPosts) =>
            currentPosts.map((post) =>
              post.id === editingPostId ? mapPostRow(data, currentUserProfile.id) : post
            )
          );
        }
      } else {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === editingPostId
              ? {
                  ...post,
                  image: draft.image,
                  caption: draft.caption,
                  category: draft.category,
                }
              : post
          )
        );
      }
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        userId: currentUserProfile.id || null,
        username: currentUser.username,
        displayName: currentUser.displayName,
        badge: currentUser.badge,
        image: draft.image,
        caption: draft.caption,
        category: draft.category,
        score: 8.9,
        wouldFlexPercent: 82,
        fakeAiPercent: 6,
        createdAt: new Date().toISOString(),
        owner: true,
        boosted: false,
        boostLevel: null,
      };

      if (currentUserProfile.id) {
        const { data } = await createPostRow({
          user_id: currentUserProfile.id,
          username: currentUser.username,
          display_name: currentUser.displayName,
          badge: currentUser.badge,
          image_url: draft.image,
          caption: draft.caption,
          category: draft.category,
          score: newPost.score,
          would_flex_percent: newPost.wouldFlexPercent,
          fake_ai_percent: newPost.fakeAiPercent,
        });

        if (data) {
          setPosts((currentPosts) => [mapPostRow(data, currentUserProfile.id), ...currentPosts]);
        }
      } else {
        setPosts((currentPosts) => [newPost, ...currentPosts]);
      }
    }
    setPostSafetyError("");
    setPostLimitError("");
    setSelectedProfileUsername(currentUser.username);
    setDraft({
      image: "",
      category: currentUser.posts[0]?.category || "Cars",
      caption: "",
      story: "",
      confirmSafe: false,
    });
    setEditingPostId(null);
    setDraftImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCurrentView("feed");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-obsidian text-ivory">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(230,179,58,0.16),_transparent_40%)]" />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="relative z-10 space-y-6">
          {hasEnteredApp ? (
            <>
              <div className="sticky top-3 z-40 space-y-4 rounded-[2.25rem] bg-[linear-gradient(180deg,rgba(10,10,10,0.9),rgba(10,10,10,0.72))] px-1 pb-1 pt-1 backdrop-blur-xl">
                <header className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => navigateTo("feed")}
                      className="inline-flex w-fit items-center"
                      aria-label="PHLEXR"
                    >
                      <PhlexrWordmark
                        textClassName="font-display text-2xl tracking-[0.22em] text-gold"
                      />
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo("notifications")}
                        aria-label="Open notifications"
                        className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                          currentView === "notifications"
                            ? "border-gold/45 bg-[linear-gradient(180deg,rgba(230,179,58,0.16),rgba(255,255,255,0.03))] text-gold"
                            : "border-white/15 bg-white/[0.03] text-white hover:border-gold/30 hover:text-gold"
                        }`}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-gold"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6.5 9.5a5.5 5.5 0 1 1 11 0c0 5.12 2.25 6.08 2.25 7H4.25c0-.92 2.25-1.88 2.25-7Z" />
                          <path d="M10 19.25a2.25 2.25 0 0 0 4 0" />
                        </svg>
                        {unreadNotificationCount > 0 ? (
                          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-gold/45 bg-[#241a0a] px-1.5 text-[10px] font-semibold leading-none text-gold shadow-[0_0_10px_rgba(216,178,90,0.18)]">
                            {unreadNotificationCount}
                          </span>
                        ) : null}
                      </button>
                      <div ref={profileMenuRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsProfileMenuOpen((currentValue) => !currentValue)}
                          aria-label="Open account menu"
                          aria-expanded={isProfileMenuOpen}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition hover:border-gold/30"
                        >
                          <Avatar
                            src={currentUser.avatar}
                            alt={currentUser.displayName}
                            sizeClass="h-10 w-10"
                            borderClass="border-gold/40"
                          />
                        </button>
                        {isProfileMenuOpen ? (
                          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[20rem] overflow-hidden rounded-[1.65rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(14,14,14,0.97),rgba(8,8,8,0.95))] p-3 shadow-[0_28px_80px_-34px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={currentUser.avatar}
                                  alt={currentUser.displayName}
                                  sizeClass="h-12 w-12"
                                  borderClass="border-gold/40"
                                />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {currentUser.displayName}
                                  </p>
                                  <p className="mt-1 truncate text-xs text-gold">
                                    @{currentUser.username}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 grid gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    openProfile(currentUser.username);
                                  }}
                                  className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm font-semibold text-white transition hover:border-gold/28 hover:text-gold"
                                >
                                  View Profile
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    navigateTo("edit-profile");
                                  }}
                                  className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm font-semibold text-white transition hover:border-gold/28 hover:text-gold"
                                >
                                  Edit Profile
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-3">
                              {accountMenuSections.map((section) => (
                                <div
                                  key={section.title}
                                  className="rounded-[1.2rem] border border-white/8 bg-black/30 p-3"
                                >
                                  <p className="px-1 text-[11px] uppercase tracking-[0.18em] text-white/38">
                                    {section.title}
                                  </p>
                                  <div className="mt-2 grid gap-1">
                                    {section.items.map((item) => (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsProfileMenuOpen(false)}
                                        className="rounded-[0.95rem] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04] hover:text-gold"
                                      >
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3 grid gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  handleSignOut();
                                }}
                                className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm font-semibold text-white transition hover:border-gold/28 hover:text-gold"
                              >
                                Sign out
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full lg:flex lg:flex-1 lg:justify-center lg:px-6">
                      <div ref={searchRef} className="relative w-full max-w-xl">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setIsSearchOpen(true);
                          }}
                          onFocus={() => setIsSearchOpen(true)}
                          placeholder="Search"
                          className="w-full rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                        />
                        {isSearchOpen && searchQuery.trim() ? (
                          <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 overflow-hidden rounded-[1.4rem] border border-white/10 bg-obsidian/95 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur">
                            {searchResults.length ? (
                              <div className="divide-y divide-white/8">
                                {searchResults.map((result) => (
                                  <button
                                    key={result.username}
                                    type="button"
                                    onClick={() => openProfile(result.username)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.03]"
                                  >
                                    <Avatar
                                      src={result.avatar}
                                      alt={result.displayName}
                                      sizeClass="h-11 w-11"
                                      borderClass="border-gold/35"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-white">
                                        {result.displayName}
                                      </p>
                                      <p className="mt-1 truncate text-xs text-gold">
                                        @{result.username}
                                      </p>
                                    </div>
                                    <p
                                      className={`shrink-0 text-xs uppercase tracking-[0.16em] ${getStatusTextClass(
                                        result.badge
                                      )}`}
                                    >
                                      {normalizeStatus(result.badge)}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-4 text-sm text-white/50">No results</div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </header>

                <div className="hidden items-center gap-3 lg:flex">
                  {shellNav.map((item) => (
                    <button
                      key={item.view}
                      type="button"
                      onClick={() => navigateTo(item.view)}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        currentView === item.view
                          ? "bg-gold text-obsidian"
                          : "border border-white/15 bg-white/[0.03] text-white hover:border-gold/30 hover:text-gold"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <PremiumBadge tone={getStatusTone(selectedMembership.badge)}>
                    {selectedMembership.name} membership
                  </PremiumBadge>
                </div>
              </div>
            </>
          ) : (
            <header className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <PhlexrWordmark
                  href="/"
                  className="shrink-0"
                  textClassName="font-display text-lg tracking-[0.26em] text-gold sm:text-xl sm:tracking-[0.35em]"
                />
                <div className="flex flex-wrap gap-3">
                  <PremiumBadge
                    tone={getStatusTone(selectedMembership.badge)}
                    className="min-h-[3rem] px-5 py-3 text-sm tracking-[0.16em]"
                  >
                    {selectedMembership.name} membership
                  </PremiumBadge>
                  <a
                    href="/"
                    className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Back to landing page
                  </a>
                </div>
              </div>
            </header>
          )}

          {!hasEnteredApp ? (
            <SectionCard
              id="auth"
              eyebrow="01. Auth"
              title="Login / Signup"
              copy=""
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5">
                  {initialHasAccess && isAuthInitializing && authMode !== "check-email" ? (
                    <div className="flex min-h-[27rem] flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.22em] text-gold/75">
                        Restoring session
                      </p>
                      <h3 className="mt-4 text-3xl font-semibold text-white">
                        Restoring your session
                      </h3>
                      <p className="mt-4 max-w-lg text-base leading-7 text-white/62">
                        PHLEXR is confirming your account and loading the right app state.
                      </p>
                    </div>
                  ) : authMode === "check-email" ? (
                    <div className="flex min-h-[27rem] flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-gold/75">
                          Check your email
                        </p>
                        <h3 className="mt-4 text-3xl font-semibold text-white">
                          Check your email
                        </h3>
                        <p className="mt-4 max-w-lg text-base leading-7 text-white/62">
                          We sent you a confirmation link to finish creating your account.
                        </p>
                        {authForm.email ? (
                          <p className="mt-4 text-sm text-gold/85">{authForm.email}</p>
                        ) : null}
                        {authError ? (
                          <p className="mt-4 text-sm text-[#f0b4b4]">{authError}</p>
                        ) : null}
                      </div>

                      <div className="grid gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signin");
                            setAuthMessage("");
                            setAuthError("");
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                        >
                          Back to sign in
                        </button>
                        <p className="px-1 text-xs text-white/45">
                          After you confirm, the link will send you to `phlexr.com/app-shell` and the session will be picked up automatically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-white/72">Username</span>
                          <input
                            type="text"
                            value={authForm.username}
                            onChange={(event) => handleAuthFieldChange("username", event.target.value)}
                            placeholder="@phlexrname"
                            className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                          />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-white/72">Email</span>
                          <input
                            type="email"
                            value={authForm.email}
                            onChange={(event) => handleAuthFieldChange("email", event.target.value)}
                            placeholder="you@example.com"
                            className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                          />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-white/72">Password</span>
                          <div className="relative">
                            <input
                              type={isAuthPasswordVisible ? "text" : "password"}
                              value={authForm.password}
                              onChange={(event) => handleAuthFieldChange("password", event.target.value)}
                              placeholder="........"
                              className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                            />
                            <button
                              type="button"
                              aria-label={isAuthPasswordVisible ? "Hide password" : "Show password"}
                              onClick={() => setIsAuthPasswordVisible((currentValue) => !currentValue)}
                              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-white/45 transition hover:text-gold"
                            >
                              <PasswordVisibilityIcon visible={isAuthPasswordVisible} />
                            </button>
                          </div>
                        </label>
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-white/72">Birthdate</span>
                          <input
                            type="text"
                            value={safetyProfile.birthdate}
                            onChange={handleBirthdateChange}
                            inputMode="numeric"
                            autoComplete="bday"
                            maxLength={10}
                            placeholder="MM/DD/YYYY"
                            className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                          />
                          {safetyProfile.isAdult === null ? (
                            <span className="text-xs text-white/45">
                              Stored locally for safety checks only.
                            </span>
                          ) : safetyProfile.isAdult ? null : (
                            <span className="text-xs text-white/45">
                              Under-18 flag saved locally.
                            </span>
                          )}
                        </label>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <button
                          type="button"
                          onClick={handleSignIn}
                          disabled={authLoading || !supabaseReady}
                          className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          {authLoading && authMode === "signin" ? "Signing in..." : "Sign in"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateAccount}
                          disabled={authLoading || !supabaseReady}
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          {authLoading && authMode === "signup" ? "Creating..." : "Create account"}
                        </button>
                        {authMode === "signup" ? (
                          <>
                            <TurnstileWidget
                              resetKey={signupCaptchaResetCount}
                              onVerify={(token) => {
                                setSignupCaptchaToken(token);
                                setAuthError("");
                              }}
                              onExpire={() => setSignupCaptchaToken("")}
                              onError={() => {
                                setSignupCaptchaToken("");
                                setAuthError("Verification failed. Try again.");
                              }}
                            />
                          </>
                        ) : null}
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/55"
                        >
                          Continue with Google
                        </button>
                        <Link
                          href="/recover-account"
                          className="px-1 text-sm text-white/58 transition hover:text-gold"
                        >
                          Forgot email / username?
                        </Link>
                        <Link
                          href="/reset-password"
                          className="px-1 text-sm text-white/58 transition hover:text-gold"
                        >
                          Forgot Password?
                        </Link>
                        {authError ? (
                          <p className="px-1 text-sm text-[#f0b4b4]">{authError}</p>
                        ) : null}
                        {authMessage ? (
                          <p className="px-1 text-sm text-gold/85">{authMessage}</p>
                        ) : null}
                        {authMode === "signup" ? (
                          <div className="mt-2 rounded-[1.35rem] border border-white/10 bg-white/[0.02] px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gold/75">
                              Account disclosures
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/58">
                              By creating a PHLEXR account, you agree to the platform rules that
                              govern posting, comments, follows, notifications, boosts,
                              memberships, moderation, and account safety. Review the policies
                              below before joining.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {[
                                ["Terms & Conditions", "/terms-conditions"],
                                ["Privacy / Safety Policy", "/privacy-safety-policy"],
                                ["Cookies Policy", "/cookies-policy"],
                                [
                                  "How PHLEXR uses your email or phone",
                                  "/account-contact-info",
                                ],
                                ["Copyright / Trademark Policy", "/copyright-trademark-policy"],
                                ["Community Guidelines", "/community-guidelines"],
                                ["Reporting / Abuse / Safety", "/reporting-abuse-safety"],
                                ["Contact / Support", "/contact-support"],
                              ].map(([label, href]) => (
                                <Link
                                  key={href}
                                  href={href}
                                  className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/78 transition hover:border-gold/30 hover:text-gold"
                                >
                                  {label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>

                <MembershipPlansPanel
                  selectedMembershipId={effectiveMembershipId}
                  setSelectedMembershipId={setSelectedMembershipId}
                  currentUser={currentUser}
                />
              </div>
            </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "feed" ? (
          <SectionCard
            id="feed"
            eyebrow="02. Feed"
            title="Feed"
            copy="Seeded PHLEXR flex posts with local score data, trust signals, and working vote controls."
            hideHeader
          >
            <div className="mb-5 flex gap-4 overflow-x-auto pb-2">
              {leaderboardPreview.map((entry, index) => (
                <button
                  key={entry.username}
                  type="button"
                  onClick={() => openProfile(entry.username)}
                  className={`min-w-[10rem] rounded-[1.4rem] border bg-black/35 p-4 text-left transition ${
                    index === 0
                      ? "border-[#d8b25a]/85 shadow-[0_0_20px_rgba(216,178,90,0.25)] hover:border-[#d8b25a]"
                      : "border-white/10 hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        src={entry.avatar}
                        alt={entry.displayName}
                        sizeClass="h-12 w-12"
                        borderClass="border-gold/45"
                      />
                      {index === 0 ? (
                        <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#d8b25a]/55 bg-[#241a0a]/95 shadow-[0_0_10px_rgba(216,178,90,0.22)]">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-3 w-3 fill-[#efc467]"
                          >
                            <path d="M5.25 18.5h13.5a1 1 0 0 0 .98-1.21l-1.63-8.12a.75.75 0 0 0-1.22-.42l-3.02 2.67-4.36-6.03a.75.75 0 0 0-1.22 0L3.92 11.42.9 8.75a.75.75 0 0 0-1.22.42l-1.63 8.12a1 1 0 0 0 .98 1.21h6.27Z" />
                          </svg>
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{entry.displayName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold/75">
                        #{index + 1} · {formatScore(entry.averageScore)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`mt-3 truncate text-xs uppercase tracking-[0.16em] ${getStatusTextClass(entry.badge)}`}
                  >
                    {normalizeStatus(entry.badge)}
                  </p>
                </button>
              ))}
              <button
                type="button"
                onClick={openLeaderboard}
                className="min-w-[10rem] rounded-[1.4rem] border border-gold/25 bg-[linear-gradient(180deg,rgba(230,179,58,0.12),rgba(255,255,255,0.02))] p-4 text-left transition hover:border-gold/40"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-gold/75">Leaderboard</p>
                <p className="mt-3 text-lg font-semibold text-white">See Leaderboard</p>
                <p className="mt-2 text-sm text-white/52">Open the full rankings page</p>
              </button>
            </div>
            <div className="grid items-stretch gap-5 xl:grid-cols-2">
              {sortedFeedPosts.length === 0 ? (
                <div className="rounded-[1.7rem] border border-white/8 bg-black/35 p-6 sm:p-8 xl:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold/75">Feed</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">No posts yet</h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
                    Your authenticated feed is now showing real PHLEXR posts only. Create your first post to start your feed.
                  </p>
                </div>
              ) : null}
              {sortedFeedPosts.map((post) => {
                const lockedVote = votedPosts[post.id];
                const postComments = comments.filter((comment) => comment.postId === post.id);
                return (
                <article
                  key={post.id}
                  className="flex h-full min-h-[42rem] flex-col overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/35"
                >
                  <img
                    src={post.image}
                    alt={post.displayName}
                    className="h-64 w-full object-cover sm:h-72"
                  />
                    <div className="grid flex-1 grid-rows-[6.5rem_5.5rem_auto_auto_auto_auto_auto_auto] gap-y-5 p-4 sm:grid-rows-[6.5rem_5.5rem_auto_auto_minmax(0,7.75rem)_4.5rem_auto_auto] sm:p-5">
                    <div className="relative pr-32">
                      <div className="min-w-0">
                        <p className="text-2xl font-semibold text-white">{post.displayName}</p>
                        <p className="mt-2 text-sm text-white/55">
                          <span className="text-gold">@{post.username}</span>
                          <span className="text-white/35"> | </span>
                          <span className={getStatusTextClass(post.badge)}>
                            {normalizeStatus(post.badge)}
                          </span>
                          <span className="text-white/35"> | </span>
                          <span>{formatRelativeTime(post.createdAt || post.timestamp)}</span>
                        </p>
                        {post.boosted ? (
                          <span className="mt-2 inline-flex w-fit items-center rounded-full border border-gold/25 bg-[linear-gradient(180deg,rgba(230,179,58,0.12),rgba(255,255,255,0.02))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold/85">
                            Boosted {post.boostLevel}
                          </span>
                        ) : null}
                      </div>
                      <div className="absolute right-0 top-0 flex h-12 items-start">
                        <PremiumBadge>Score {formatScore(post.score)}</PremiumBadge>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <p className="text-base leading-7 text-white/68">{post.caption}</p>
                    </div>

                    <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
                      {post.owner ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingPost(post)}
                              className="inline-flex h-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-gold/30 hover:text-gold sm:h-9 sm:px-4 sm:text-xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="inline-flex h-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-gold/30 hover:text-gold sm:h-9 sm:px-4 sm:text-xs"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleBoostMenu(post.id)}
                              className="inline-flex h-8 items-center justify-center rounded-full border border-gold/35 bg-[linear-gradient(180deg,rgba(230,179,58,0.14),rgba(255,255,255,0.02))] px-3 py-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#efc467] transition hover:border-gold/55 hover:bg-[linear-gradient(180deg,rgba(230,179,58,0.18),rgba(255,255,255,0.03))] sm:h-9 sm:px-4 sm:text-xs"
                            >
                              {post.boosted ? `Boosted ${post.boostLevel}` : "Boost"}
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="flex min-h-0 items-start">
                      {post.owner && boostMenuPostId === post.id ? (
                        <div className="w-full rounded-[1.2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-3 sm:p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs uppercase tracking-[0.16em] text-gold/72">
                              Choose a boost window
                            </p>
                            <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
                              {boostOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => handleBoostSelect(post.id, option.value)}
                                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                    post.boostLevel === option.value && post.boosted
                                      ? "bg-gold text-obsidian"
                                      : "border border-white/15 bg-white/[0.03] text-white hover:border-gold/35 hover:text-gold"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                      <div className="grid grid-cols-1 gap-3 sm:h-full sm:grid-cols-3">
                      {[
                        ["Would-Flex", formatPercent(post.wouldFlexPercent)],
                        ["Fake / AI", formatPercent(post.fakeAiPercent)],
                        ["Category", post.category],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                        >
                          <div className="flex h-12 items-start">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                              {label}
                            </p>
                          </div>
                          <div className="flex flex-1 items-start">
                            <p
                              className={`min-w-0 font-semibold leading-tight text-gold ${
                                label === "Category"
                                  ? "text-lg sm:text-xl"
                                  : "text-xl leading-none sm:text-2xl"
                              }`}
                            >
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-0 sm:h-full xl:grid-cols-4 xl:items-end">
                      {[
                        ["Flex", "flex"],
                        ["Not It", "notIt"],
                        ["Fake-AI", "fakeAi"],
                      ].map(([label, action], index) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleVote(post.id, action)}
                          disabled={Boolean(pendingVotes[post.id])}
                          className={`rounded-full px-4 py-3 text-sm font-semibold transition xl:h-full ${
                            lockedVote === action
                              ? "bg-gold text-obsidian"
                              : index === 0
                                ? "bg-gold text-obsidian"
                                : "border border-white/15 bg-white/[0.03] text-white"
                          } ${
                            pendingVotes[post.id]
                              ? "cursor-wait opacity-75"
                              : lockedVote && lockedVote !== action
                                ? "border border-white/15 bg-white/[0.03] text-white"
                                : ""
                          } ${
                            !pendingVotes[post.id] && index !== 0 && lockedVote !== action
                              ? "hover:border-gold/30 hover:text-gold"
                              : ""
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSharePost(post)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-3 text-sm font-semibold text-gold transition hover:border-gold/50 hover:text-[#f1cf7b] xl:h-full"
                      >
                        <ShareIcon />
                        <span>Share</span>
                      </button>
                    </div>
                    <div className="flex min-h-4 items-center">
                      {voteErrors[post.id] ? (
                        <p className="text-xs uppercase tracking-[0.18em] text-[#f0b4b4]">
                          {voteErrors[post.id]}
                        </p>
                      ) : shareFeedback[post.id] ? (
                        <p className="text-xs uppercase tracking-[0.18em] text-gold/70">
                          {shareFeedback[post.id]}
                        </p>
                      ) : lockedVote ? (
                        <p className="text-xs uppercase tracking-[0.18em] text-gold/70">
                          Vote locked for this post
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">
                          Comments ({postComments.length})
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Public only
                        </p>
                      </div>

                      <div className="mt-4 space-y-3">
                        {postComments.length ? (
                          postComments.map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-[1.1rem] border border-white/8 bg-black/30 p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {comment.displayName}
                                  </p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gold/75">
                                    @{comment.username} | {formatRelativeTime(comment.createdAt)}
                                  </p>
                                </div>
                                {comment.isReported ? (
                                  <span className="text-xs uppercase tracking-[0.14em] text-gold/70">
                                    Reported
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-3 text-sm leading-6 text-white/68">{comment.text}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {comment.username === currentUser.username ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-gold/30 hover:text-gold"
                                  >
                                    Delete
                                  </button>
                                ) : null}
                                <select
                                  value={commentReportReasons[comment.id] || "Other"}
                                  onChange={(event) =>
                                    setCommentReportReasons((currentReasons) => ({
                                      ...currentReasons,
                                      [comment.id]: event.target.value,
                                    }))
                                  }
                                  className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white outline-none"
                                >
                                  {[
                                    "Threat",
                                    "Private info",
                                    "Scam / spam",
                                    "Predatory behavior",
                                    "Nudity / explicit",
                                    "Other",
                                  ].map((reason) => (
                                    <option key={reason} className="bg-obsidian text-white">
                                      {reason}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleReportComment(comment.id)}
                                  className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-gold/30 hover:text-gold"
                                >
                                  Report
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-white/45">No comments yet.</p>
                        )}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <input
                          type="text"
                          value={commentDrafts[post.id] || ""}
                          onChange={(event) => handleCommentDraftChange(post.id, event.target.value)}
                          placeholder="Add a public comment"
                          className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                        />
                        {commentErrors[post.id] ? (
                          <p className="text-sm text-gold">{commentErrors[post.id]}</p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                        >
                          Post comment
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "post" ? (
          <SectionCard
            id="post"
            eyebrow="03. Post"
            title="Post page"
            copy="A clean creation flow for local uploads, captions, categories, and live preview before publish."
            hideHeader
          >
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <form
                onSubmit={handlePostSubmit}
                className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5"
              >
                {editingPostId ? (
                  <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.25rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold/75">
                        Editing post
                      </p>
                      <p className="mt-1 text-sm text-white/62">
                        Update your flex and save it locally.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPostId(null);
                        setDraft({
                          image: "",
                          category: currentUser.posts[0]?.category || "Cars",
                          caption: "",
                          story: "",
                          confirmSafe: false,
                        });
                        setDraftImageName("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-gold/30 hover:text-gold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Upload image</span>
                    <div className="rounded-[1.5rem] border border-dashed border-gold/28 bg-white/[0.02] p-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="post-image-upload"
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*,video/*"
                        capture="environment"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="post-camera-capture"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label
                          htmlFor="post-image-upload"
                          className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-white/15 bg-black/30 px-4 text-center transition hover:border-gold/35"
                        >
                          <span className="text-sm font-semibold text-gold">Upload from device</span>
                          <span className="mt-2 text-sm text-white/55">
                            {draftImageName || "PNG, JPG, WEBP, GIF, or AVIF"}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={handleOpenCamera}
                          className="flex min-h-28 flex-col items-center justify-center rounded-[1.25rem] border border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 text-center transition hover:border-gold/45 hover:text-[#f1cf7b]"
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                            <CameraIcon />
                            <span>Use Camera</span>
                          </span>
                          <span className="mt-2 text-sm text-white/55">
                            Take a fresh shot without leaving PHLEXR
                          </span>
                        </button>
                      </div>
                    </div>
                  </label>
                  {cameraError ? <p className="text-sm text-gold">{cameraError}</p> : null}
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Image URL fallback</span>
                    <input
                      type="url"
                      value={draft.image.startsWith("data:") ? "" : draft.image}
                      onChange={handleImageUrlChange}
                      placeholder="https://..."
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Caption</span>
                    <input
                      type="text"
                      value={draft.caption}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          caption: event.target.value,
                        }))
                      }
                      placeholder="What makes this flex undeniable?"
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Category</span>
                    <div ref={categoryMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen((currentValue) => !currentValue)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-gold outline-none transition"
                        aria-haspopup="listbox"
                        aria-expanded={isCategoryOpen}
                      >
                        <span>{draft.category}</span>
                        <span className="text-sm text-gold/70">{isCategoryOpen ? "▲" : "▼"}</span>
                      </button>

                      {isCategoryOpen ? (
                        <div
                          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[1.25rem] border border-gold/20 bg-obsidian shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)]"
                          role="listbox"
                          aria-label="Category"
                        >
                          <div className="max-h-72 overflow-y-auto p-2">
                            {categories.map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => {
                                  setDraft((currentDraft) => ({
                                    ...currentDraft,
                                    category,
                                  }));
                                  setIsCategoryOpen(false);
                                }}
                                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                                  draft.category === category
                                    ? "bg-gold text-obsidian"
                                    : "text-gold hover:bg-gold hover:text-obsidian"
                                }`}
                                role="option"
                                aria-selected={draft.category === category}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Story</span>
                    <textarea
                      rows={5}
                      value={draft.story}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          story: event.target.value,
                        }))
                      }
                      placeholder="Tell the story behind the flex."
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={draft.confirmSafe}
                      onChange={(event) => {
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          confirmSafe: event.target.checked,
                        }));
                        setPostSafetyError("");
                        setPostLimitError("");
                      }}
                      className="mt-1 h-4 w-4 accent-[#e6b33a]"
                    />
                    <span className="text-sm leading-6 text-white/72">
                      I confirm this image contains no nudity or explicit content.
                    </span>
                  </label>
                  {postSafetyError ? (
                    <p className="text-sm text-gold">{postSafetyError}</p>
                  ) : null}
                  {postLimitError ? (
                    <div className="rounded-[1.2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-3">
                      <p className="text-sm text-gold">{postLimitError}</p>
                      <button
                        type="button"
                        onClick={() => navigateTo("membership")}
                        className="mt-3 inline-flex items-center rounded-full border border-gold/35 bg-[linear-gradient(180deg,rgba(230,179,58,0.14),rgba(255,255,255,0.02))] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#efc467] transition hover:border-gold/55"
                      >
                        Upgrade Status
                      </button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={!draft.image}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                >
                  {editingPostId ? "Save post changes" : "Post to local feed"}
                </button>
              </form>

              <div className="rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Live preview</p>
                <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/35">
                  {draft.image ? (
                    <img
                      src={draft.image}
                      alt="Post preview"
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-72 place-items-center bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-6 text-center">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-gold/70">
                          Image preview
                        </p>
                        <p className="mt-4 text-xl font-semibold text-white">
                          Your upload will appear here instantly
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/50">
                          Choose a photo from your device or paste an image URL to build a local
                          PHLEXR post preview.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-4 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-semibold text-white">@{currentUser.username}</p>
                      <PremiumBadge tone={getStatusTone(currentUser.badge)}>
                        {currentUser.badge}
                      </PremiumBadge>
                    </div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                      {selectedMembership.name} plan · {currentUserPostCount} posts
                    </p>
                    <p className="text-base leading-7 text-white/65">
                      {draft.caption || "What makes this flex undeniable?"}
                    </p>
                    <p className="text-sm uppercase tracking-[0.18em] text-gold/70">
                      {draft.category} preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "profile" ? (
          <SectionCard
            id="profile"
            eyebrow="04. Profile"
            title="Profile page"
            copy="Score-rich profile layout with premium badge visibility, live stats, and a grid of locally seeded posts."
            hideHeader
          >
            <div className="grid gap-6">
              <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={selectedProfile.avatar}
                      alt={selectedProfile.displayName}
                      sizeClass="h-20 w-20"
                      borderClass="border-2 border-gold/55"
                    />
                    <div>
                      <p className="text-3xl font-semibold text-white">{selectedProfile.displayName}</p>
                      <p className="mt-2 text-sm text-gold">@{selectedProfile.username}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <PremiumBadge tone={getStatusTone(selectedProfile.badge)}>
                          {selectedProfile.badge}
                        </PremiumBadge>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Member since 2026
                        </p>
                      </div>
                      <p className="mt-2 text-base text-white/55">{selectedProfile.location}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
                        {selectedProfile.bio || "No bio added yet."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {!isOwnProfile ? (
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(selectedProfile.username)}
                        className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                          isFollowingSelectedProfile
                            ? "border border-gold/30 bg-[linear-gradient(180deg,rgba(230,179,58,0.12),rgba(255,255,255,0.02))] text-gold"
                            : "border border-white/15 bg-white/[0.03] text-white hover:border-gold/30 hover:text-gold"
                        }`}
                      >
                        {isFollowingSelectedProfile ? "Following" : "Follow"}
                      </button>
                    ) : null}
                    {isOwnProfile ? (
                      <>
                        {isFounderProfile ? (
                          <p className="text-xs uppercase tracking-[0.16em] text-gold/75">
                            Founder · Permanent Elite
                          </p>
                        ) : effectiveMembershipId === "elite" ? (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center rounded-full border border-gold/28 bg-[linear-gradient(180deg,rgba(230,179,58,0.12),rgba(255,255,255,0.02))] px-5 py-3 text-sm font-semibold text-gold/85"
                          >
                            {profileUpgradeLabel}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigateTo("membership")}
                            className="inline-flex items-center rounded-full border border-gold/35 bg-[linear-gradient(180deg,rgba(230,179,58,0.14),rgba(255,255,255,0.02))] px-5 py-3 text-sm font-semibold text-[#efc467] transition hover:border-gold/55"
                          >
                            {profileUpgradeLabel}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => navigateTo("edit-profile")}
                          className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                        >
                          Edit profile
                        </button>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                        >
                          Sign out
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    {
                      label: "Total Posts",
                      value: selectedProfile.totalPosts,
                      valueClass: "text-gold",
                    },
                    {
                      label: "Average Score",
                      value: formatScore(selectedProfile.averageScore || 0),
                      valueClass: "text-gold",
                    },
                    {
                      label: "Tier",
                      value: normalizeStatus(selectedProfile.badge),
                      valueClass: getStatusTextClass(selectedProfile.badge),
                    },
                    {
                      label: "Followers",
                      value: selectedProfileFollowers.toLocaleString(),
                      valueClass: "text-gold",
                    },
                    {
                      label: "Following",
                      value: selectedProfileFollowing.toLocaleString(),
                      valueClass: "text-white",
                    },
                  ].map(({ label, value, valueClass }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                      <p className={`mt-2 text-3xl font-semibold ${valueClass}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProfileTopFlex ? (
                <div className="overflow-hidden rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))]">
                  <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <img
                      src={selectedProfileTopFlex.image}
                      alt={selectedProfileTopFlex.caption}
                      className="h-72 w-full object-cover"
                    />
                    <div className="p-5 sm:p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold/75">Top Flex</p>
                      <div className="mt-4 flex items-center gap-3">
                        <PremiumBadge>Score {formatScore(selectedProfileTopFlex.score)}</PremiumBadge>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                          {selectedProfileTopFlex.category}
                        </p>
                      </div>
                      <p className="mt-5 text-2xl font-semibold text-white">
                        {selectedProfileTopFlex.caption || "Highest-scoring flex"}
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                            Would-Flex
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-gold">
                            {formatPercent(selectedProfileTopFlex.wouldFlexPercent)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                            Fake / AI
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-gold">
                            {formatPercent(selectedProfileTopFlex.fakeAiPercent)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {selectedProfile.posts.length ? (
                  selectedProfile.posts.map((post) => (
                    <div
                      key={post.id}
                      className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/35"
                    >
                      <img src={post.image} alt={post.caption} className="h-56 w-full object-cover" />
                      <div className="p-4">
                        <p className="text-lg font-semibold text-white">{post.category}</p>
                        <p className="mt-2 text-sm text-white/60">{post.caption}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-white/8 bg-black/35 p-5 text-sm text-white/55">
                    No flex posts yet.
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "edit-profile" ? (
          <SectionCard
            id="edit-profile"
            eyebrow="05. Edit"
            title="Edit profile"
            copy="Update your profile details and keep them synced to your PHLEXR account."
            hideHeader
          >
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <form
                onSubmit={handleProfileSave}
                className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5"
              >
                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Display name</span>
                    <input
                      type="text"
                      value={profileDraft.displayName}
                      onChange={(event) =>
                        setProfileDraft((currentDraft) => ({
                          ...currentDraft,
                          displayName: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Username</span>
                    <input
                      type="text"
                      value={profileDraft.username}
                      onChange={(event) =>
                        setProfileDraft((currentDraft) => ({
                          ...currentDraft,
                          username: event.target.value.toLowerCase().replace(/\s+/g, ""),
                        }))
                      }
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Bio</span>
                    <textarea
                      rows={4}
                      value={profileDraft.bio}
                      onChange={(event) =>
                        setProfileDraft((currentDraft) => ({
                          ...currentDraft,
                          bio: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Location</span>
                    <input
                      type="text"
                      value={profileDraft.location}
                      onChange={(event) =>
                        setProfileDraft((currentDraft) => ({
                          ...currentDraft,
                          location: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Profile photo URL</span>
                    <input
                      type="url"
                      value={profileDraft.avatar.startsWith("data:") ? "" : profileDraft.avatar}
                      onChange={(event) => {
                        setProfileImageName("");
                        setProfileDraft((currentDraft) => ({
                          ...currentDraft,
                          avatar: event.target.value,
                        }));
                      }}
                      placeholder="https://..."
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <div className="rounded-[1.5rem] border border-dashed border-gold/28 bg-white/[0.02] p-4">
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                      onChange={handleProfileImageFileChange}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-white/15 bg-black/30 px-4 text-center transition hover:border-gold/35"
                    >
                      <span className="text-sm font-semibold text-gold">Upload profile image</span>
                      <span className="mt-2 text-sm text-white/55">
                        {profileImageName || "PNG, JPG, WEBP, GIF, or AVIF"}
                      </span>
                    </label>
                  </div>
                </div>

                {profileSaveError ? (
                  <p className="mt-5 text-sm text-[#f0b4b4]">{profileSaveError}</p>
                ) : null}
                {profileSaveMessage ? (
                  <p className="mt-5 text-sm text-gold/85">{profileSaveMessage}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isProfileSaving ? "Saving..." : "Save profile"}
                </button>
              </form>

              <div className="rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Profile preview</p>
                <div className="mt-5 rounded-[1.6rem] border border-white/8 bg-black/35 p-5">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={profileDraft.avatar}
                      alt={profileDraft.displayName}
                      sizeClass="h-20 w-20"
                      borderClass="border-2 border-gold/55"
                    />
                    <div>
                      <p className="text-2xl font-semibold text-white">{profileDraft.displayName}</p>
                      <p className="mt-2 text-sm text-gold">@{profileDraft.username}</p>
                      <p className="mt-2 text-sm text-white/55">{profileDraft.location}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <PremiumBadge tone={getStatusTone(currentUserProfile.badge)}>
                      {currentUserProfile.badge}
                    </PremiumBadge>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-white/60">
                    {profileDraft.bio || "Write a short line that tells people what kind of flexes you post."}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "membership" ? (
          <SectionCard
            id="membership"
            eyebrow="06. Membership"
            title="Membership"
            copy="Choose the PHLEXR tier that controls your visible status and local boost pricing."
            hideHeader
          >
            <MembershipPlansPanel
              selectedMembershipId={effectiveMembershipId}
              setSelectedMembershipId={setSelectedMembershipId}
              currentUser={currentUser}
            />
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "notifications" ? (
          <SectionCard
            id="notifications"
            eyebrow="06. Notifications"
            title="Notifications"
            copy="PHLEXR activity powered by follows, comments, ratings, and boosts."
            hideHeader
          >
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Notifications</p>
                  <p className="mt-1 text-sm text-white/55">
                    {unreadNotificationCount > 0
                      ? `${unreadNotificationCount} unread`
                      : "All caught up"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllNotificationsRead}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                >
                  Mark all as read
                </button>
              </div>

              {sortedNotifications.length ? (
                <div className="grid gap-3">
                  {sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-[1.5rem] border p-4 transition ${
                        notification.read
                          ? "border-white/8 bg-black/25"
                          : "border-gold/20 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))]"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => handleNotificationOpen(notification)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p
                            className={`text-sm sm:text-base ${
                              notification.read ? "text-white/68" : "font-semibold text-white"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-gold/75">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </button>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs uppercase tracking-[0.16em] ${
                              notification.read ? "text-white/35" : "text-gold"
                            }`}
                          >
                            {notification.read ? "Read" : "Unread"}
                          </span>
                          {!notification.read ? (
                            <button
                              type="button"
                              onClick={() => handleMarkNotificationRead(notification.id)}
                              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                            >
                              Mark read
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-white/8 bg-black/25 px-5 py-8 text-center text-sm text-white/48">
                  No notifications yet.
                </div>
              )}
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "leaderboard" ? (
          <SectionCard
            id="leaderboard"
            eyebrow="06. Leaderboard"
            title="Leaderboard"
            copy="High-status ranking view built live from the same local dataset that powers the feed and profile."
            hideHeader
          >
            <div className="grid gap-4">
              {profiles.map((entry, index) => (
                <button
                  type="button"
                  key={entry.username}
                  onClick={() => openProfile(entry.username)}
                  className={`flex flex-col gap-4 rounded-[1.5rem] border bg-black/35 p-4 text-left transition sm:flex-row sm:items-center sm:justify-between ${
                    index === 0
                      ? "translate-y-[-1px] border-[#d8b25a]/85 shadow-[0_0_20px_rgba(216,178,90,0.25)] hover:border-[#d8b25a]"
                      : "border-white/8 hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-white/[0.03] text-lg font-semibold text-gold">
                      {index + 1}
                    </div>
                    <div className="relative">
                      <Avatar
                        src={entry.avatar}
                        alt={entry.displayName}
                        sizeClass="h-14 w-14"
                        borderClass="border-2 border-gold/45"
                      />
                      {index === 0 ? (
                        <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d8b25a]/55 bg-[#241a0a]/95 shadow-[0_0_10px_rgba(216,178,90,0.22)]">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 fill-[#efc467]"
                          >
                            <path d="M5.25 18.5h13.5a1 1 0 0 0 .98-1.21l-1.63-8.12a.75.75 0 0 0-1.22-.42l-3.02 2.67-4.36-6.03a.75.75 0 0 0-1.22 0L3.92 11.42.9 8.75a.75.75 0 0 0-1.22.42l-1.63 8.12a1 1 0 0 0 .98 1.21h6.27Z" />
                          </svg>
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">{entry.displayName}</p>
                      <p className={`mt-2 text-sm ${getStatusTextClass(entry.badge)}`}>
                        {normalizeStatus(entry.badge)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-gold/25 bg-[#2c2010] px-4 py-2 text-lg text-[#efc467]">
                      {formatScore(entry.averageScore)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
          ) : null}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-obsidian/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          {[
            { label: "Feed", view: "feed" },
            { label: "Post", view: "post" },
            { label: "Ranks", view: "leaderboard" },
            { label: "Profile", view: "profile" },
          ].map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() =>
                item.view === "profile" ? openProfile(currentUser.username) : navigateTo(item.view)
              }
              className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-medium transition ${
                currentView === item.view
                  ? "bg-gold text-obsidian"
                  : "border border-white/15 bg-white/[0.03] text-white/72"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      {isCameraOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-6 pt-20 backdrop-blur-sm sm:items-center">
          <button
            type="button"
            aria-label="Close camera"
            onClick={closeCameraCapture}
            className="absolute inset-0"
          />
          <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(20,20,20,0.96),rgba(12,12,12,0.94))] p-5 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.95)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold/75">Camera</p>
                <p className="mt-3 text-2xl font-semibold text-white">Capture your flex</p>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  Take a shot and drop it straight into your PHLEXR post draft.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCameraCapture}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-gold/30 hover:text-gold"
              >
                <span className="text-lg leading-none">x</span>
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/50">
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className="aspect-[4/5] w-full object-cover sm:aspect-video"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCaptureFromCamera}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
              >
                Capture photo
              </button>
              <button
                type="button"
                onClick={closeCameraCapture}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
              >
                Cancel
              </button>
            </div>
            <canvas ref={cameraCanvasRef} className="hidden" />
          </div>
        </div>
      ) : null}
      {activeSharePostId ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 pt-20 backdrop-blur-sm sm:items-center">
          <button
            type="button"
            aria-label="Close share sheet"
            onClick={closeShareSheet}
            className="absolute inset-0"
          />
          <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(20,20,20,0.96),rgba(12,12,12,0.94))] p-5 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.95)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold/75">Share</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {shareSheetView === "primary" ? "Share this flex" : "More ways to share"}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  {shareSheetView === "primary"
                    ? "Choose where to send it without leaving PHLEXR first."
                    : "Open another destination without losing your place in PHLEXR."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeShareSheet}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-gold/30 hover:text-gold"
              >
                <span className="text-lg leading-none">x</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {shareSheetView === "primary" ? (
                <>
                  {canShowTextShareOption() ? (
                    <button
                      type="button"
                      onClick={() => handleExternalShare("text")}
                      className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                    >
                      Text
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleExternalShare("messenger")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Messenger
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("reddit")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Reddit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("instagram")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("gmail")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("email")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("facebook")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("x")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    X
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="rounded-[1.35rem] border border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-4 text-sm font-semibold text-gold transition hover:border-gold/50 hover:text-[#f1cf7b]"
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    onClick={openMoreShareSheet}
                    className="rounded-[1.35rem] border border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-4 text-sm font-semibold text-gold transition hover:border-gold/50 hover:text-[#f1cf7b]"
                  >
                    ⋯ More
                  </button>
                  {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="rounded-[1.35rem] border border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-4 text-sm font-semibold text-gold transition hover:border-gold/50 hover:text-[#f1cf7b]"
                    >
                      Native share
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openPrimaryShareSheet}
                    className="rounded-[1.35rem] border border-gold/24 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] px-4 py-4 text-sm font-semibold text-gold transition hover:border-gold/50 hover:text-[#f1cf7b]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("snapchat")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Snapchat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("drive")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("discord")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Discord
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExternalShare("pinterest")}
                    className="rounded-[1.35rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                  >
                    Pinterest
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

