import { PhlexrWordmark } from "@/components/brand/PhlexrLogo";

const featureCards = [
  {
    title: "Post your flex",
    copy:
      "Upload your best moments — cars, wins, lifestyle, whatever you’re proud of.",
  },
  {
    title: "Get rated instantly",
    copy:
      "Other users vote: Flex, Not It, or Fake. Your score updates in real time.",
  },
  {
    title: "Climb the leaderboard",
    copy:
      "Build your score, gain followers, and compete to become one of the top profiles.",
  },
];

const realFlexExamples = [
  {
    label: "PREMIUM",
    labelClassName: "bg-[#3a2c12] text-gold border border-gold/35",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Black exotic supercar parked outside a luxury mansion at night",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    name: 'Marcus "Prime" T.',
    location: "Miami, FL",
    score: "9.8",
    topFlexes: [
      "2024 Lamborghini Revuelto $482K",
      'Rolex Daytona "John Mayer" $155K',
    ],
    scanned: "Scanned 23 min ago",
  },
  {
    label: "CERTIFIED",
    labelClassName: "bg-[#16365c] text-white border border-[#5f8dc8]/35",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Luxury black designer handbag in warm lighting",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    name: "Layla R.",
    location: "Los Angeles, CA",
    score: "9.5",
    topFlexes: ["Chanel Diamond Bag $32K"],
    scanned: "Scanned 1 hour ago",
  },
  {
    label: "ELITE",
    labelClassName: "bg-[#3f2d14] text-gold border border-gold/35",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Gold Rolex watch in a dark luxury setting",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    name: "Zay K.",
    location: "Dubai, UAE",
    score: "9.7",
    topFlexes: ["Rolex Daytona 18k Gold $75K"],
    scanned: "Scanned 3 hours ago",
  },
  {
    label: "OG",
    labelClassName: "bg-[#103733] text-[#6af0d8] border border-[#2ad4b8]/35",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Black classic lowrider parked outside a mountain luxury home at night",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=300&auto=format&fit=crop",
    name: 'Dante "OG" W.',
    location: "Aspen, CO",
    score: "9.3",
    topFlexes: ["Black 1964 Impala Lowrider $65K"],
    scanned: "Scanned 5 hours ago",
  },
];

const metrics = [
  { label: "Rating", value: "9.1/10" },
  { label: "Would-Flex %", value: "87%" },
  { label: "Fake / AI", value: "06%" },
];

export default async function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-obsidian text-ivory">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian"
      >
        Skip to content
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,_rgba(230,179,58,0.18),_transparent_45%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-12">
          <PhlexrWordmark
            href="#top"
            textClassName="font-display text-lg tracking-[0.26em] text-gold sm:text-xl sm:tracking-[0.35em]"
          />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-sm text-white/70 md:flex"
          >
            <a href="#features" className="transition hover:text-gold">
              Features
            </a>
            <a href="#reserve" className="transition hover:text-gold">
              Reserve
            </a>
          </nav>

          <a
            href="#reserve"
            className="inline-flex items-center rounded-full border border-gold/40 bg-gold px-4 py-2 text-xs font-semibold text-obsidian transition hover:bg-gold-soft sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Get early access
          </a>
        </div>
      </header>

      <div id="top" />

      <section
        id="main-content"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:pb-28 lg:pt-24"
      >
        <div>
          <div className="inline-flex max-w-full items-center rounded-full border border-gold/20 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold/90 sm:text-xs sm:tracking-[0.24em]">
            Premium social credibility
          </div>

          <h1 className="mt-6 max-w-3xl text-balance text-4xl leading-none text-white sm:mt-8 sm:text-6xl lg:text-7xl">
            <PhlexrWordmark
              textClassName="font-display text-white"
              tmClassName="text-white/82"
            />
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gold sm:mt-5 sm:text-2xl">
            Post it. Prove it. Get rated.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:mt-6 sm:leading-8 sm:text-lg">
            PHLEXR is where people post and get real attention. Every post gets rated instantly
            — Flex, Not It, or Fake. Build your profile, grow your following, and see how you
            rank.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#reserve"
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian transition hover:bg-gold-soft"
            >
              Reserve username
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold/40 hover:text-gold"
            >
              See features
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="max-w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.8)] sm:p-5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-full">
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,_rgba(230,179,58,0.2),_transparent_62%)] blur-2xl" />
          <div className="relative max-w-full overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-3 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.95)] sm:p-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-[#090909] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/80">
                    Featured flex
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Weekend receipt drop
                  </h2>
                </div>
                <div className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  live rating
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-[linear-gradient(135deg,#1a1a1a,#0c0c0c)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-sm font-semibold text-gold">
                    PX
                  </div>
                  <div>
                    <p className="font-semibold text-white">@Alex Richards</p>
                    <p className="text-sm text-white/48">Rolex, Jet, Hublot, Lambo.</p>
                  </div>
                </div>

                <div className="mt-5 relative overflow-hidden rounded-[1.25rem] border border-gold/30">
                  <img
                    src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop"
                    alt="Luxury black supercar"
                    className="h-[240px] w-full object-cover sm:h-[320px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-gold/80">
                      Flex Scan Ready
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">Score incoming</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Rating", "9.1"],
                    ["Would-flex %", "87%"],
                    ["Fake / AI %", "06%"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="max-w-full rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-gold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <span>Consensus says the flex is real.</span>
                <span className="font-semibold uppercase tracking-[0.18em] text-gold">
                  Verified heat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          <h2 className="text-balance font-display text-3xl text-white sm:text-5xl">
            Where your flex actually matters.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/62 sm:leading-8 sm:text-lg">
            PHLEXR stays focused: premium presentation, sharp scoring, and a username reserve
            flow that feels like an invite-only social launch.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="max-w-full rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.9)] sm:p-7"
            >
              <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-4 text-base leading-7 text-white/62">{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-gold/18 bg-[radial-gradient(circle_at_top,rgba(230,179,58,0.09),rgba(255,255,255,0.015)_42%,rgba(0,0,0,0)_72%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-semibold text-white sm:text-5xl">
              {"\uD83D\uDD25"} Real Flex Examples
            </h3>
            <p className="mx-auto mt-4 max-w-4xl text-lg leading-8 text-white/62">
              Verified profiles from the PHLEXR community — this is what getting scanned looks
              like.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {realFlexExamples.map((example) => (
              <article
                key={example.name}
                className="flex h-full max-w-full min-h-[38rem] flex-col overflow-hidden rounded-[1.85rem] border border-gold/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_24px_80px_-40px_rgba(0,0,0,0.95)]"
              >
                <div className="relative">
                  <img
                    src={example.image}
                    alt={example.imageAlt}
                    className="h-48 w-full object-cover sm:h-52"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span
                      className={`inline-flex rounded-xl px-3 py-1.5 text-sm font-semibold tracking-[0.06em] ${example.labelClassName}`}
                    >
                      {example.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col border-t border-gold/12 bg-[linear-gradient(180deg,#12100d,#0b0b0b)] p-4 sm:p-5">
                  <div className="flex min-h-[7.5rem] items-center gap-4">
                    <img
                      src={example.avatar}
                      alt={example.name}
                      className="h-16 w-16 rounded-full border-2 border-gold/55 object-cover"
                    />
                    <div className="flex min-h-[5.5rem] min-w-0 flex-col justify-center">
                      <p className="text-[1.7rem] font-semibold leading-none text-white sm:text-[2rem]">
                        {example.name}
                      </p>
                      <p className="mt-3 text-base text-[#ddb76b] sm:text-lg">
                        {example.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex min-h-[3.5rem] items-start">
                    <div className="inline-flex max-w-full rounded-full border border-gold/25 bg-[#2c2010] px-4 py-2 text-base text-[#efc467] sm:px-5 sm:text-lg">
                      PHLEX Score: {example.score}
                    </div>
                  </div>

                  <div className="mt-5 flex min-h-[12rem] flex-col border-t border-gold/12 pt-4">
                    <div className="min-h-[1.75rem]">
                      <p className="text-sm uppercase tracking-[0.12em] text-white/48">
                        Top Flexes
                      </p>
                    </div>
                    <div className="mt-3 grid gap-3">
                      {example.topFlexes.map((flex) => (
                        <div
                          key={flex}
                          className="max-w-full rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-base text-white/92 sm:text-xl"
                        >
                          {flex}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-5 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between sm:text-base">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#7ad267]" />
                      <span>{example.scanned}</span>
                    </div>
                    <span className="rounded-full bg-[#0d3a1e] px-4 py-1.5 text-[#d8ffe3]">
                      Verified
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-5 rounded-[2rem] border border-gold/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-6 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-5">
              <div className="flex justify-center -space-x-4">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=300&auto=format&fit=crop",
                ].map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt="PHLEXR profile avatar"
                    className="h-14 w-14 rounded-full border-2 border-[#d5ad58] object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="text-3xl font-semibold text-white sm:text-4xl">
                  10,247+ profiles scanned today
                </p>
              </div>
            </div>

            <div className="inline-flex w-full items-center justify-center rounded-full border border-[#2b7b47] bg-[linear-gradient(180deg,#12341c,#0b2414)] px-6 py-3 text-lg font-medium text-[#d4ffe0] sm:w-auto sm:text-xl">
              <span className="mr-3 text-[#7beb83]">{"\u26A1"}</span>
              Live Feed Active
            </div>
          </div>
        </div>
      </section>

      <section
        id="reserve"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="overflow-hidden rounded-[2rem] border border-gold/18 bg-[linear-gradient(135deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-6 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold/80">Early access</p>
              <h2 className="mt-4 text-balance font-display text-3xl text-white sm:text-5xl">
                Reserve your PHLEXR username before the drop.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:leading-8 sm:text-lg">
                Keep it simple: collect interest, claim names early, and send the strongest early
                users straight into launch.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-black/45 p-5 sm:p-6">
              <form
                action="https://formsubmit.co/phlexrapp@gmail.com"
                method="POST"
                className="grid gap-4"
              >
                <input type="hidden" name="_subject" value="New PHLEXR Waitlist Signup" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">Desired username</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="@yourname"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/40"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/40"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian transition hover:bg-gold-soft"
                >
                  Reserve my username
                </button>
              </form>

              <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                No backend added here on purpose. This keeps the repo Vercel-ready and easy to
                hook into a waitlist tool later.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gold/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),rgba(0,0,0,0))]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <PhlexrWordmark textClassName="font-display text-2xl tracking-[0.22em] text-gold" />
              <p className="mt-3 text-sm text-white/58">Post it. Prove it. Get rated.</p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              {[
                ["Facebook", "https://www.facebook.com/profile.php?id=61578504254021"],
                ["X", "https://x.com/Phlexr_Official"],
                ["Instagram", "https://instagram.com/phelxr_Official"],
                ["TikTok", "https://tiktok.com/@phlexr"],
              ].map(([social, href]) => (
                <a
                  key={social}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/78 transition hover:border-gold/30 hover:text-gold hover:shadow-[0_0_18px_rgba(230,179,58,0.15)]"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/8 pt-6 text-center text-sm text-white/45">
            {"\u00A9"} 2026 PHLEXR. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
