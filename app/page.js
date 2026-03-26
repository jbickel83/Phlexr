const featureCards = [
  {
    title: "Proof-first scoring",
    copy:
      "Every flex gets broken down into a clean score, confidence signal, and credibility snapshot.",
  },
  {
    title: "Spot fake heat fast",
    copy:
      "See the gap between what looks impressive and what actually holds up under scrutiny.",
  },
  {
    title: "Reserve your name early",
    copy:
      "Claim your handle before launch and step into the feed with your identity locked in.",
  },
];

const metrics = [
  { label: "Rating", value: "9.1/10" },
  { label: "Would-Flex %", value: "87%" },
  { label: "Fake / AI", value: "06%" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian"
      >
        Skip to content
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,_rgba(230,179,58,0.18),_transparent_45%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="font-display text-xl tracking-[0.35em] text-gold">
            PHLEXR
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-gold">
              Features
            </a>
            <a href="#reserve" className="transition hover:text-gold">
              Reserve
            </a>
          </nav>

          <a
            href="#reserve"
            className="inline-flex items-center rounded-full border border-gold/40 bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-gold-soft"
          >
            Get early access
          </a>
        </div>
      </header>

      <div id="top" />

      <section
        id="main-content"
        className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:pb-28 lg:pt-24"
      >
        <div>
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold/90">
            Premium social credibility
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
            PHLEXR
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-gold sm:text-2xl">
            Post it. Prove it. Get rated.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            A black-and-gold launch page for the next social app built to rate the flex, surface
            the truth, and reward what actually holds up.
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

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.8)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,_rgba(230,179,58,0.2),_transparent_62%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.95)]">
            <div className="rounded-[1.6rem] border border-white/10 bg-[#090909] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/80">Featured flex</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Weekend receipt drop</h2>
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
                    <p className="font-semibold text-white">@phlexrfounder</p>
                    <p className="text-sm text-white/48">Rolex, jet stairs, midnight caption.</p>
                  </div>
                </div>

                <div className="mt-5 relative overflow-hidden rounded-[1.25rem] border border-gold/30">

                  <img
                    src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1600&auto=format&fit=crop"
                    className="w-full h-[320px] object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-gold/80">
                      Flex Scan Ready
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      Score incoming
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Rating", "9.1"],
                    ["Would-flex %", "87%"],
                    ["Fake / AI %", "06%"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-gold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/62">
                <span>Consensus says the flex is real.</span>
                <span className="font-semibold uppercase tracking-[0.18em] text-gold">Verified heat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Built to make the flex undeniable.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/62 sm:text-lg">
            PHLEXR stays focused: premium presentation, sharp scoring, and a username reserve
            flow that feels like an invite-only social launch.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-7 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.9)]"
            >
              <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-4 text-base leading-7 text-white/62">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reserve" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="overflow-hidden rounded-[2rem] border border-gold/18 bg-[linear-gradient(135deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold/80">Early access</p>
              <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
                Reserve your PHLEXR username before the drop.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                Keep it simple: collect interest, claim names early, and send the strongest early
                users straight into launch.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-black/45 p-5 sm:p-6">
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">Desired username</span>
                  <input
                    type="text"
                    placeholder="@yourname"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/40"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/40"
                  />
                </label>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian transition hover:bg-gold-soft"
                >
                  Reserve my username
                </button>
              </div>

              <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                No backend added here on purpose. This keeps the repo Vercel-ready and easy to hook
                into a waitlist tool later.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
