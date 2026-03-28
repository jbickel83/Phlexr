"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

const defaultCurrentUserProfile = {
  username: "phlexrfounder",
  displayName: "PHLEXR Founder",
  badge: "PHLEXR ELITE",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
  location: "Miami, FL",
  bio: "Building the cleanest flex-rating platform on the internet.",
};

const seededPosts = [
  {
    id: "post-1",
    username: "marcusprime",
    displayName: "Marcus Prime",
    badge: "PHLEXR ELITE",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    caption: "Midnight delivery. Mansion lights. No explanation needed.",
    category: "Cars",
    score: 9.8,
    wouldFlexPercent: 94,
    fakeAiPercent: 3,
    timestamp: "23 min ago",
    owner: false,
  },
  {
    id: "post-2",
    username: "laylaroyale",
    displayName: "Layla Royale",
    badge: "VERIFIED PREMIUM",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
    caption: "Diamond flap. Soft launch. Real pressure only.",
    category: "Handbags",
    score: 9.4,
    wouldFlexPercent: 88,
    fakeAiPercent: 7,
    timestamp: "1 hour ago",
    owner: false,
  },
  {
    id: "post-3",
    username: "zayk",
    displayName: "Zay K.",
    badge: "GOLD VERIFIED",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop",
    caption: "18k pressure with skyline energy behind it.",
    category: "Watches",
    score: 9.7,
    wouldFlexPercent: 91,
    fakeAiPercent: 4,
    timestamp: "3 hours ago",
    owner: false,
  },
  {
    id: "post-4",
    username: "danteog",
    displayName: 'Dante "OG"',
    badge: "OG STATUS",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
    caption: "Classic body. Mountain air. No replica energy anywhere near it.",
    category: "Cars",
    score: 9.3,
    wouldFlexPercent: 86,
    fakeAiPercent: 5,
    timestamp: "5 hours ago",
    owner: false,
  },
  {
    id: "post-5",
    username: "phlexrfounder",
    displayName: "PHLEXR Founder",
    badge: "PHLEXR ELITE",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop",
    caption: "Camera flash. Midnight energy. Clean proof only.",
    category: "Cars",
    score: 9.1,
    wouldFlexPercent: 85,
    fakeAiPercent: 5,
    timestamp: "12 min ago",
    owner: true,
  },
];

const profileDirectory = {
  marcusprime: {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    location: "Miami, FL",
  },
  laylaroyale: {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    location: "Los Angeles, CA",
  },
  zayk: {
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    location: "Dubai, UAE",
  },
  danteog: {
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=300&auto=format&fit=crop",
    location: "Aspen, CO",
  },
  phlexrfounder: {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    location: "Miami, FL",
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

function PremiumBadge({ children }) {
  return (
    <span className="inline-flex h-9 w-fit items-center justify-center whitespace-nowrap rounded-full border border-gold/30 bg-[#2b200f] px-3 py-0 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-gold sm:h-auto sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em]">
      {children}
    </span>
  );
}

function formatPercent(value) {
  return `${Math.max(0, Math.min(99, Math.round(value)))}%`;
}

function formatScore(value) {
  return value.toFixed(1);
}

export default function AppShellPage() {
  const [posts, setPosts] = useState(seededPosts);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [currentView, setCurrentView] = useState("feed");
  const [selectedProfileUsername, setSelectedProfileUsername] = useState(
    defaultCurrentUserProfile.username
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [votedPosts, setVotedPosts] = useState({});
  const [currentUserProfile, setCurrentUserProfile] = useState(defaultCurrentUserProfile);
  const [draft, setDraft] = useState({
    image: "",
    category: "Cars",
    caption: "",
    story: "",
  });
  const [draftImageName, setDraftImageName] = useState("");
  const [profileDraft, setProfileDraft] = useState(defaultCurrentUserProfile);
  const [profileImageName, setProfileImageName] = useState("");
  const categoryMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  const profiles = useMemo(() => {
    const grouped = posts.reduce((accumulator, post) => {
      if (!accumulator[post.username]) {
        const profile = post.owner
          ? currentUserProfile
          : profileDirectory[post.username] || profileDirectory.phlexrfounder;
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

  const selectedProfile =
    profiles.find((profile) => profile.username === selectedProfileUsername) || currentUser;
  const leaderboardPreview = profiles.slice(0, 5);
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
    leaderboard: {
      eyebrow: "Rankings",
      title: "Leaderboard",
      copy: "Top performers across the same local dataset powering the feed and profiles.",
    },
  };

  useEffect(() => {
    function handlePointerDown(event) {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryOpen(false);
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

    const hashView = window.location.hash.replace("#", "");
    if (!hashView) {
      return;
    }

    const validViews = new Set(["feed", "post", "profile", "edit-profile", "leaderboard"]);
    if (validViews.has(hashView)) {
      setHasEnteredApp(true);
      setCurrentView(hashView);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedPosts = window.localStorage.getItem(POSTS_STORAGE_KEY);
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          setPosts(parsedPosts);
        }
      }

      const savedVotes = window.localStorage.getItem(VOTED_POSTS_STORAGE_KEY);
      if (savedVotes) {
        const parsedVotes = JSON.parse(savedVotes);
        if (parsedVotes && typeof parsedVotes === "object") {
          setVotedPosts(parsedVotes);
        }
      }

      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile && typeof parsedProfile === "object") {
          const mergedProfile = {
            ...defaultCurrentUserProfile,
            ...parsedProfile,
          };
          setCurrentUserProfile(mergedProfile);
          setProfileDraft(mergedProfile);
          setSelectedProfileUsername(mergedProfile.username);
        }
      } else {
        setProfileDraft(defaultCurrentUserProfile);
      }
    } catch {
      window.localStorage.removeItem(POSTS_STORAGE_KEY);
      window.localStorage.removeItem(VOTED_POSTS_STORAGE_KEY);
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(VOTED_POSTS_STORAGE_KEY, JSON.stringify(votedPosts));
  }, [votedPosts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(currentUserProfile));
    setProfileDraft(currentUserProfile);
  }, [currentUserProfile]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasEnteredApp) {
      return;
    }

    window.location.hash = currentView;
  }, [currentView, hasEnteredApp]);

  function enterShell(targetId = "feed") {
    setHasEnteredApp(true);
    setCurrentView(targetId);
  }

  function openProfile(username) {
    setHasEnteredApp(true);
    setSelectedProfileUsername(username);
    setCurrentView("profile");
  }

  function openLeaderboard() {
    setHasEnteredApp(true);
    setCurrentView("leaderboard");
  }

  function navigateTo(view) {
    setHasEnteredApp(true);
    setCurrentView(view);
  }

  function handleVote(postId, voteType) {
    if (votedPosts[postId]) {
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const adjustments = {
          flex: { score: 0.12, wouldFlexPercent: 3, fakeAiPercent: -1 },
          notIt: { score: -0.18, wouldFlexPercent: -4, fakeAiPercent: 1 },
          fakeAi: { score: -0.26, wouldFlexPercent: -6, fakeAiPercent: 4 },
        };

        const change = adjustments[voteType];

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
      })
    );
    setVotedPosts((currentVotes) => ({
      ...currentVotes,
      [postId]: voteType,
    }));
  }

  function handleImageUrlChange(event) {
    setDraftImageName("");
    setDraft((currentDraft) => ({
      ...currentDraft,
      image: event.target.value,
    }));
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
      setDraft((currentDraft) => ({
        ...currentDraft,
        image: result,
      }));
      setDraftImageName(selectedFile.name);
    };
    reader.readAsDataURL(selectedFile);
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
    };
    reader.readAsDataURL(selectedFile);
  }

  function handleProfileSave(event) {
    event.preventDefault();
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
    setCurrentUserProfile(nextProfile);
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
    setCurrentView("profile");
  }

  function handlePostSubmit(event) {
    event.preventDefault();
    setHasEnteredApp(true);

    if (!draft.image) {
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      username: currentUser.username,
      displayName: currentUser.displayName,
      badge: currentUser.badge,
      image: draft.image,
      caption: draft.caption,
      category: draft.category,
      score: 8.9,
      wouldFlexPercent: 82,
      fakeAiPercent: 6,
      timestamp: "Just now",
      owner: true,
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setSelectedProfileUsername(currentUser.username);
    setDraft({
      image: "",
      category: currentUser.posts[0]?.category || "Cars",
      caption: "",
      story: "",
    });
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
              <header className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigateTo("feed")}
                    className="font-display text-2xl tracking-[0.22em] text-gold"
                  >
                    PHLEXR
                  </button>
                  <div className="hidden min-w-0 flex-1 px-6 lg:block">
                    <p className="truncate text-center text-sm uppercase tracking-[0.22em] text-white/42">
                      {viewMeta[currentView]?.eyebrow}
                    </p>
                    <p className="mt-1 truncate text-center text-lg font-semibold text-white">
                      {viewMeta[currentView]?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="/"
                      className="hidden rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold sm:inline-flex"
                    >
                      Back to landing page
                    </a>
                    <button
                      type="button"
                      onClick={() => openProfile(currentUser.username)}
                      className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-2 transition hover:border-gold/30"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.displayName}
                        className="h-10 w-10 rounded-full border border-gold/40 object-cover"
                      />
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-white">{currentUser.displayName}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-gold/75">
                          View profile
                        </p>
                      </div>
                    </button>
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
                <PremiumBadge>Premium badge system</PremiumBadge>
              </div>
            </>
          ) : (
            <header className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Separate App Route</p>
                  <h1 className="mt-4 text-balance font-display text-4xl text-white sm:text-5xl">
                    PHLEXR app shell
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/62 sm:text-lg">
                    Seeded local-state prototype for the real PHLEXR app experience. No backend, no
                    APIs, no persistence, just polished shell behavior.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <PremiumBadge>Premium badge system</PremiumBadge>
                  <a
                    href="/"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
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
              copy="A high-trust entry screen with direct account fields, platform buttons, and a clear premium badge preview."
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5">
                  <div className="grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-white/72">Username</span>
                      <input
                        type="text"
                        placeholder="@phlexrname"
                        className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-white/72">Email</span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-white/72">Password</span>
                      <input
                        type="password"
                        placeholder="........"
                        className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <button
                      type="button"
                      onClick={() => enterShell("feed")}
                      className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={() => enterShell("feed")}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white"
                    >
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      onClick={() => enterShell("feed")}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white"
                    >
                      Continue with Apple
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-5">
                  <PremiumBadge>PHLEXR elite preview</PremiumBadge>
                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    Premium badge visibility
                  </h3>
                  <p className="mt-3 text-base leading-7 text-white/62">
                    Paid and verified members get elevated profile polish, badge visibility on every
                    screen, and higher trust at first glance.
                  </p>
                  <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/40 p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.displayName}
                        className="h-16 w-16 rounded-full border-2 border-gold/55 object-cover"
                      />
                      <div>
                        <p className="text-2xl font-semibold text-white">
                          {currentUser.displayName}
                        </p>
                        <p className="mt-2 text-sm text-gold">
                          Badge visible on auth, feed, profile, leaderboard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                  className="min-w-[10rem] rounded-[1.4rem] border border-white/10 bg-black/35 p-4 text-left transition hover:border-gold/20"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.avatar}
                      alt={entry.displayName}
                      className="h-12 w-12 rounded-full border border-gold/45 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{entry.displayName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold/75">
                        #{index + 1} · {formatScore(entry.averageScore)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 truncate text-xs uppercase tracking-[0.16em] text-white/45">
                    {entry.badge}
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
              {posts.map((post) => {
                const lockedVote = votedPosts[post.id];
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
                  <div className="grid flex-1 grid-rows-[6.5rem_5.5rem_minmax(0,7.75rem)_4.5rem_auto] gap-y-5 p-4 sm:p-5">
                    <div className="relative pr-32">
                      <div className="min-w-0">
                        <p className="text-2xl font-semibold text-white">{post.displayName}</p>
                        <p className="mt-2 text-sm text-gold">
                          @{post.username} · {post.badge} · {post.timestamp}
                        </p>
                      </div>
                      <div className="absolute right-0 top-0 flex h-12 items-start">
                        <PremiumBadge>Score {formatScore(post.score)}</PremiumBadge>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <p className="text-base leading-7 text-white/68">{post.caption}</p>
                    </div>

                    <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
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

                    <div className="grid h-full grid-cols-1 items-end gap-3 sm:grid-cols-3">
                      {[
                        ["Flex", "flex"],
                        ["Not It", "notIt"],
                        ["Fake-AI", "fakeAi"],
                      ].map(([label, action], index) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleVote(post.id, action)}
                          disabled={Boolean(lockedVote)}
                          className={`h-full rounded-full px-4 py-3 text-sm font-semibold transition ${
                            lockedVote === action
                              ? "bg-gold text-obsidian"
                              : index === 0
                                ? "bg-gold text-obsidian"
                                : "border border-white/15 bg-white/[0.03] text-white"
                          } ${
                            lockedVote && lockedVote !== action
                              ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/35"
                              : ""
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex min-h-4 items-center">
                      {lockedVote ? (
                        <p className="text-xs uppercase tracking-[0.18em] text-gold/70">
                          Vote locked for this post
                        </p>
                      ) : null}
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
          >
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <form
                onSubmit={handlePostSubmit}
                className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5"
              >
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
                      <label
                        htmlFor="post-image-upload"
                        className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-white/15 bg-black/30 px-4 text-center transition hover:border-gold/35"
                      >
                        <span className="text-sm font-semibold text-gold">Choose image</span>
                        <span className="mt-2 text-sm text-white/55">
                          {draftImageName || "PNG, JPG, WEBP, GIF, or AVIF"}
                        </span>
                      </label>
                    </div>
                  </label>
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
                </div>

                <button
                  type="submit"
                  disabled={!draft.image}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                >
                  Post to local feed
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
                      <PremiumBadge>{currentUser.badge}</PremiumBadge>
                    </div>
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
          >
            <div className="grid gap-6">
              <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProfile.avatar}
                      alt={selectedProfile.displayName}
                      className="h-20 w-20 rounded-full border-2 border-gold/55 object-cover"
                    />
                    <div>
                      <p className="text-3xl font-semibold text-white">{selectedProfile.displayName}</p>
                      <p className="mt-2 text-sm text-gold">@{selectedProfile.username}</p>
                      <p className="mt-2 text-base text-white/55">{selectedProfile.location}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
                        {selectedProfile.bio || "No bio added yet."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <PremiumBadge>{selectedProfile.badge}</PremiumBadge>
                    {selectedProfile.username === currentUser.username ? (
                      <button
                        type="button"
                        onClick={() => navigateTo("edit-profile")}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                      >
                        Edit profile
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["Total Posts", selectedProfile.totalPosts],
                    ["Average Score", formatScore(selectedProfile.averageScore || 0)],
                    ["Badge", selectedProfile.badge],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                      <p className="mt-2 text-3xl font-semibold text-gold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

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
                    No posts yet. Upload a flex to populate this profile.
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
            copy="Update your visible identity in the shell and keep it stored locally across refreshes."
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

                <button
                  type="submit"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                >
                  Save local profile
                </button>
              </form>

              <div className="rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Profile preview</p>
                <div className="mt-5 rounded-[1.6rem] border border-white/8 bg-black/35 p-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={profileDraft.avatar}
                      alt={profileDraft.displayName}
                      className="h-20 w-20 rounded-full border-2 border-gold/55 object-cover"
                    />
                    <div>
                      <p className="text-2xl font-semibold text-white">{profileDraft.displayName}</p>
                      <p className="mt-2 text-sm text-gold">@{profileDraft.username}</p>
                      <p className="mt-2 text-sm text-white/55">{profileDraft.location}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <PremiumBadge>{currentUserProfile.badge}</PremiumBadge>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-white/60">
                    {profileDraft.bio || "Write a short line that tells people what kind of flexes you post."}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
          ) : null}

          {hasEnteredApp && currentView === "leaderboard" ? (
          <SectionCard
            id="leaderboard"
            eyebrow="06. Leaderboard"
            title="Leaderboard"
            copy="High-status ranking view built live from the same local dataset that powers the feed and profile."
          >
            <div className="grid gap-4">
              {profiles.map((entry, index) => (
                <button
                  type="button"
                  key={entry.username}
                  onClick={() => openProfile(entry.username)}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-black/35 p-4 text-left transition hover:border-gold/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-white/[0.03] text-lg font-semibold text-gold">
                      {index + 1}
                    </div>
                    <img
                      src={entry.avatar}
                      alt={entry.displayName}
                      className="h-14 w-14 rounded-full border-2 border-gold/45 object-cover"
                    />
                    <div>
                      <p className="text-2xl font-semibold text-white">{entry.displayName}</p>
                      <p className="mt-2 text-sm text-gold">{entry.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumBadge>Premium visible</PremiumBadge>
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
    </main>
  );
}
