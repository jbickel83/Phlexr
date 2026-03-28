const shellNav = [
  { label: "Auth", href: "#auth" },
  { label: "Feed", href: "#feed" },
  { label: "Post", href: "#post" },
  { label: "Profile", href: "#profile" },
  { label: "Ranks", href: "#leaderboard" },
];

const feedPosts = [
  {
    user: "Marcus Prime",
    badge: "PHLEXR ELITE",
    score: "9.8",
    wouldFlex: "94%",
    fakeAi: "03%",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    caption: "Midnight delivery. Mansion lights. No explanation needed.",
  },
  {
    user: "Layla Royale",
    badge: "VERIFIED PREMIUM",
    score: "9.4",
    wouldFlex: "88%",
    fakeAi: "07%",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
    caption: "Diamond flap. Soft launch. Real pressure only.",
  },
];

const leaderboard = [
  ["Marcus Prime", "PHLEXR ELITE", "9.8"],
  ["Zay K.", "GOLD VERIFIED", "9.7"],
  ["Layla Royale", "PREMIUM", "9.5"],
  ["Dante OG", "OG STATUS", "9.3"],
];

const profilePosts = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
];

function SectionCard({ id, eyebrow, title, copy, children }) {
  return (
    <section
      id={id}
      className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-6"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-gold/75">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">{copy}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function PremiumBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/30 bg-[#2b200f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
      {children}
    </span>
  );
}

export default function AppShellPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-obsidian text-ivory">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(230,179,58,0.16),_transparent_40%)]" />

      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <aside className="sticky top-6 hidden h-fit w-64 rounded-[2rem] border border-white/10 bg-black/35 p-5 lg:block">
          <p className="font-display text-2xl tracking-[0.22em] text-gold">PHLEXR</p>
          <p className="mt-3 text-sm text-white/55">App shell preview</p>
          <nav className="mt-8 grid gap-2">
            {shellNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-white/72 transition hover:border-gold/20 hover:bg-white/[0.03] hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="relative z-10 flex-1 space-y-6">
          <header className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Separate App Route</p>
                <h1 className="mt-4 text-balance font-display text-4xl text-white sm:text-5xl">
                  PHLEXR app shell
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/62 sm:text-lg">
                  Premium shell screens for the real PHLEXR app experience, kept separate from the
                  landing page and ready for backend wiring later.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <PremiumBadge>Premium badge system</PremiumBadge>
                <a
                  href="/"
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                >
                  Back to landing page
                </a>
              </div>
            </div>
          </header>

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
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Email</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Password</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-3">
                  <button className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian">
                    Enter PHLEXR
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white">
                    Continue with Google
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white">
                    Continue with Apple
                  </button>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-5">
                <PremiumBadge>PHLEXR elite preview</PremiumBadge>
                <h3 className="mt-5 text-2xl font-semibold text-white">Premium badge visibility</h3>
                <p className="mt-3 text-base leading-7 text-white/62">
                  Paid and verified members get elevated profile polish, badge visibility on every
                  screen, and higher trust at first glance.
                </p>
                <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/40 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
                      alt="Premium member"
                      className="h-16 w-16 rounded-full border-2 border-gold/55 object-cover"
                    />
                    <div>
                      <p className="text-2xl font-semibold text-white">Marcus Prime</p>
                      <p className="mt-2 text-sm text-gold">Badge visible on auth, feed, profile, leaderboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="feed"
            eyebrow="02. Feed"
            title="Feed"
            copy="Example flex posts with score data, trust signals, and fast swipe-era actions."
          >
            <div className="grid gap-5 xl:grid-cols-2">
              {feedPosts.map((post) => (
                <article
                  key={post.user}
                  className="overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/35"
                >
                  <img
                    src={post.image}
                    alt={post.user}
                    className="h-64 w-full object-cover sm:h-72"
                  />
                  <div className="grid gap-5 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold text-white">{post.user}</p>
                        <p className="mt-2 text-sm text-gold">{post.badge}</p>
                      </div>
                      <PremiumBadge>Score {post.score}</PremiumBadge>
                    </div>
                    <p className="text-base leading-7 text-white/68">{post.caption}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        ["Would-Flex", post.wouldFlex],
                        ["Fake / AI", post.fakeAi],
                        ["Trust", post.score],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                          <p className="mt-2 text-2xl font-semibold text-gold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {["Flex", "Not It", "Fake-AI"].map((action, index) => (
                        <button
                          key={action}
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            index === 0
                              ? "bg-gold text-obsidian"
                              : "border border-white/10 bg-white/[0.03] text-white"
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="post"
            eyebrow="03. Post"
            title="Post page"
            copy="A clean creation flow for uploads, captions, storytelling, and premium preview before publish."
          >
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-4 sm:p-5">
                <div className="grid gap-4">
                  <div className="grid min-h-40 place-items-center rounded-[1.5rem] border border-dashed border-gold/28 bg-white/[0.02] text-center text-white/55">
                    Drop image or video here
                  </div>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Caption</span>
                    <input
                      type="text"
                      placeholder="What makes this flex undeniable?"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Category</span>
                    <select className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none">
                      <option>Cars</option>
                      <option>Watches</option>
                      <option>Fashion</option>
                      <option>Travel</option>
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Story</span>
                    <textarea
                      rows={5}
                      placeholder="Tell the story behind the flex."
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Live preview</p>
                <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/35">
                  <img
                    src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop"
                    alt="Post preview"
                    className="h-72 w-full object-cover"
                  />
                  <div className="grid gap-4 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-semibold text-white">@phlexrfounder</p>
                      <PremiumBadge>Awaiting scan</PremiumBadge>
                    </div>
                    <p className="text-base leading-7 text-white/65">
                      Midnight delivery. Camera flash. Storyline locked before the first vote.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="profile"
            eyebrow="04. Profile"
            title="Profile page"
            copy="Score-rich profile layout with premium badge visibility, stats, and a grid of flex posts."
          >
            <div className="grid gap-6">
              <div className="rounded-[1.6rem] border border-white/8 bg-black/35 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
                      alt="Profile avatar"
                      className="h-20 w-20 rounded-full border-2 border-gold/55 object-cover"
                    />
                    <div>
                      <p className="text-3xl font-semibold text-white">Marcus Prime</p>
                      <p className="mt-2 text-base text-white/55">Miami, FL</p>
                    </div>
                  </div>
                  <PremiumBadge>PHLEXR elite</PremiumBadge>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["PHLEX Score", "9.8"],
                    ["Would-Flex", "94%"],
                    ["Fake / AI", "03%"],
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {profilePosts.map((image) => (
                  <div
                    key={image}
                    className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/35"
                  >
                    <img src={image} alt="Profile post" className="h-56 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="leaderboard"
            eyebrow="05. Leaderboard"
            title="Leaderboard"
            copy="High-status ranking view with badge visibility front and center."
          >
            <div className="grid gap-4">
              {leaderboard.map(([name, badge, score], index) => (
                <div
                  key={name}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-white/[0.03] text-lg font-semibold text-gold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">{name}</p>
                      <p className="mt-2 text-sm text-gold">{badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumBadge>Premium visible</PremiumBadge>
                    <div className="rounded-full border border-gold/25 bg-[#2c2010] px-4 py-2 text-lg text-[#efc467]">
                      {score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-obsidian/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          {shellNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-xs font-medium text-white/72"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}
