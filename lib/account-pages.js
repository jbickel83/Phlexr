export const accountMenuSections = [
  {
    title: "Account",
    items: [
      { label: "Account Center", href: "/account" },
      { label: "Account Privacy", href: "/account/privacy" },
      { label: "Subscriptions", href: "/subscriptions" },
    ],
  },
  {
    title: "Social",
    items: [
      { label: "Friends", href: "/friends" },
      { label: "Saved", href: "/saved" },
      { label: "Archive", href: "/archive" },
      { label: "Blocked Accounts", href: "/blocked" },
    ],
  },
  {
    title: "Business",
    items: [{ label: "Affiliate Program", href: "/affiliate" }],
  },
  {
    title: "Legal & Privacy",
    items: [
      { label: "Privacy Center", href: "/privacy" },
      { label: "Consumer Health Privacy", href: "/consumer-health" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
  {
    title: "Support",
    items: [{ label: "Report a Problem", href: "/report" }],
  },
];

export const accountPages = {
  account: {
    href: "/account",
    title: "Account Center",
    eyebrow: "PHLEXR Account",
    intro:
      "Manage the core settings tied to your PHLEXR identity, sign-in details, memberships, boosts, notifications, and platform history from one place.",
    cards: [
      {
        title: "Sign-in and recovery",
        body:
          "Review your account email, secure your login, and update recovery details used for password resets and security alerts.",
      },
      {
        title: "Membership and boosts",
        body:
          "Track your current PHLEXR plan, boost access, and future billing controls as paid tools expand across the platform.",
      },
      {
        title: "Notifications and activity",
        body:
          "Control service notices, social alerts, and activity tied to follows, comments, ratings, shares, and moderation updates.",
      },
    ],
  },
  "account-privacy": {
    href: "/account/privacy",
    title: "Account Privacy",
    eyebrow: "PHLEXR Privacy Controls",
    intro:
      "Shape how your PHLEXR profile, posts, comments, and activity signals appear across the app while keeping trust and safety protections intact.",
    cards: [
      {
        title: "Profile visibility",
        body:
          "Decide how much profile context you share through your display name, location, bio, and badge presentation when users discover your flexes.",
      },
      {
        title: "Interaction controls",
        body:
          "Set boundaries around follows, comments, mentions, and notification behavior without breaking platform moderation and safety workflows.",
      },
      {
        title: "Review and retention",
        body:
          "Certain moderation, fraud, and voting records may still be retained when PHLEXR needs them for trust, abuse handling, or legal compliance.",
      },
    ],
  },
  subscriptions: {
    href: "/subscriptions",
    title: "Subscriptions",
    eyebrow: "PHLEXR Plans",
    intro:
      "Keep track of your PHLEXR membership status, premium access, boost pricing, and any future recurring products tied to your account.",
    cards: [
      {
        title: "Current plan",
        body:
          "See which membership tier is active on your account and what that means for status signals, posting limits, and boost pricing.",
      },
      {
        title: "Billing readiness",
        body:
          "PHLEXR is structured for paid membership features, even when some controls are still being phased in.",
      },
      {
        title: "Plan support",
        body:
          "Use PHLEXR support if your plan, boost access, or upgrade flow looks wrong so the team can review account history and fix it.",
      },
    ],
  },
  friends: {
    href: "/friends",
    title: "Friends",
    eyebrow: "PHLEXR Social Graph",
    intro:
      "Manage the people you follow, the people following you, and the profiles you want to keep close as PHLEXR’s network grows.",
    cards: [
      {
        title: "Following",
        body:
          "Keep a quick view of the profiles whose posts, comments, and ratings matter most to your feed experience.",
      },
      {
        title: "Connections",
        body:
          "Use this area to review your active social connections and spot the accounts that interact most often with your flexes.",
      },
      {
        title: "Discovery",
        body:
          "PHLEXR may suggest people to follow based on shared interests, public interactions, and mutual activity across the platform.",
      },
    ],
  },
  saved: {
    href: "/saved",
    title: "Saved",
    eyebrow: "PHLEXR Collections",
    intro:
      "Save standout flexes, reference posts, and profile moments you want to revisit without losing them in the live feed.",
    cards: [
      {
        title: "Saved flexes",
        body:
          "Keep a private set of posts for inspiration, purchase research, comparisons, or future engagement.",
      },
      {
        title: "Reference library",
        body:
          "Use saved items to revisit profiles, score patterns, and product inspiration that influence your own PHLEXR presence.",
      },
      {
        title: "Private by default",
        body:
          "Your saved list is for your own account use unless PHLEXR introduces an explicit sharing control later.",
      },
    ],
  },
  archive: {
    href: "/archive",
    title: "Archive",
    eyebrow: "PHLEXR Archive",
    intro:
      "Review older content states, removed items you still manage, and the kinds of records PHLEXR keeps available for account continuity.",
    cards: [
      {
        title: "Post history",
        body:
          "See the lifecycle of your PHLEXR content, including edits, older drafts, and content you may later restore or reference.",
      },
      {
        title: "Moderation context",
        body:
          "Some archived records support trust decisions, reporting history, and evidence preservation when moderation is involved.",
      },
      {
        title: "Quiet storage",
        body:
          "Archive is designed to keep older material out of the active spotlight while preserving useful account history.",
      },
    ],
  },
  blocked: {
    href: "/blocked",
    title: "Blocked Accounts",
    eyebrow: "PHLEXR Safety Controls",
    intro:
      "Block people who should not interact with your PHLEXR profile, comments, or social activity and keep your experience under control.",
    cards: [
      {
        title: "Who you block",
        body:
          "Blocked accounts should not be able to interact with you normally, and their visibility around your experience may be reduced or removed.",
      },
      {
        title: "Safety review",
        body:
          "PHLEXR may still preserve block-related records for abuse handling, safety escalation, and legal compliance where needed.",
      },
      {
        title: "Escalation",
        body:
          "If blocking is not enough, use the reporting flow so PHLEXR can review the account for harassment, scams, impersonation, or other abuse.",
      },
    ],
  },
  affiliate: {
    href: "/affiliate",
    title: "Affiliate Program",
    eyebrow: "PHLEXR Business",
    intro:
      "The PHLEXR affiliate program is being shaped for creators, promoters, and community partners who can drive high-trust discovery and growth.",
    cards: [
      {
        title: "Program direction",
        body:
          "PHLEXR is planning a partner structure focused on brand-safe promotion, qualified referrals, and creator-aligned growth.",
      },
      {
        title: "What to expect",
        body:
          "Future affiliate tools may include invite links, reporting dashboards, creator guidelines, and payout rules tied to approved activity.",
      },
      {
        title: "Interest list",
        body:
          "Use support or business contact channels to express interest while PHLEXR finalizes requirements and partner standards.",
      },
    ],
  },
  privacy: {
    href: "/privacy",
    title: "Privacy Center",
    eyebrow: "PHLEXR Privacy",
    intro:
      "Use the Privacy Center as your main hub for understanding what PHLEXR collects, how platform data is used, and where to manage related controls.",
    cards: [
      {
        title: "Account data",
        body:
          "Find the essentials around identity, sign-in, preferences, session handling, and how PHLEXR supports recovery and security.",
      },
      {
        title: "Content and interactions",
        body:
          "See how posts, comments, follows, votes, shares, notifications, and reports shape your experience and moderation history.",
      },
      {
        title: "Policy access",
        body:
          "Privacy Center connects you to PHLEXR’s privacy, cookies, consumer-health, safety, and terms materials from one place.",
      },
    ],
  },
  "consumer-health": {
    href: "/consumer-health",
    title: "Consumer Health Privacy",
    eyebrow: "PHLEXR Consumer Health",
    intro:
      "PHLEXR is not a medical service, but this page explains how PHLEXR approaches sensitive health-related information if it appears in user content or support interactions.",
    cards: [
      {
        title: "Not a health platform",
        body:
          "PHLEXR is built for social posting and community interaction, not diagnosis, treatment, or medical advice.",
      },
      {
        title: "Sensitive information",
        body:
          "If health-related information appears in posts, reports, or support messages, PHLEXR handles it with additional care and limits unnecessary sharing.",
      },
      {
        title: "Support and deletion",
        body:
          "If you believe sensitive health information appears on PHLEXR in a way that should be removed or restricted, contact support or report the content immediately.",
      },
    ],
  },
  terms: {
    href: "/terms",
    title: "Terms of Use",
    eyebrow: "PHLEXR Terms",
    intro:
      "Review the PHLEXR terms that govern how you use the service, including posting, commenting, memberships, boosts, follows, reporting, and moderation.",
    cards: [
      {
        title: "Platform use",
        body:
          "Terms of Use covers account responsibilities, content ownership, acceptable behavior, moderation rights, and platform safety expectations.",
      },
      {
        title: "Membership context",
        body:
          "It also explains how PHLEXR may handle tiered experiences, boosts, promotions, and account actions tied to paid or status-based features.",
      },
      {
        title: "Need the full legal page",
        body:
          "This page points to PHLEXR’s formal terms materials and acts as the account-menu entry point for users who want a quick overview first.",
      },
    ],
  },
  report: {
    href: "/report",
    title: "Report a Problem",
    eyebrow: "PHLEXR Support",
    intro:
      "Use this page to report bugs, broken features, account issues, safety concerns, or anything that is stopping PHLEXR from working the way it should.",
    cards: [
      {
        title: "Product issues",
        body:
          "Report problems with posting, sharing, comments, follows, notifications, memberships, boosts, sign-in, or account settings.",
      },
      {
        title: "Safety and abuse",
        body:
          "If the problem involves harassment, impersonation, scams, privacy violations, or another urgent safety concern, include that clearly so it can be prioritized.",
      },
      {
        title: "What helps",
        body:
          "Useful reports include your username, the page where the issue happened, what you expected, what happened instead, and any screenshots or device details.",
      },
    ],
    form: true,
  },
};

export function getAccountPage(slug) {
  return accountPages[slug];
}
