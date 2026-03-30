import Link from "next/link";
import { accountMenuSections, accountPages } from "@/lib/account-pages";
import { PhlexrImageLogo } from "@/components/brand/PhlexrLogo";

export default function AccountHubPage({ slug }) {
  const page = accountPages[slug];

  if (!page) {
    return null;
  }

  return (
    <main className="min-h-screen bg-obsidian px-4 py-14 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <PhlexrImageLogo href="/feed" />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
              >
                Back to feed
              </Link>
              <Link
                href="/app-shell"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
              >
                Back to app shell
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-gold/78">{page.eyebrow}</p>
            <h1 className="mt-4 text-balance text-3xl font-semibold text-white sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8">
              {page.intro}
            </p>

            <div className="mt-8 grid gap-4">
              {page.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.6rem] border border-white/8 bg-black/30 p-5 sm:p-6"
                >
                  <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/66 sm:text-base">{card.body}</p>
                </article>
              ))}
            </div>

            {page.form ? (
              <div className="mt-6 rounded-[1.6rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-white">Submit an issue</h2>
                <form className="mt-4 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">Issue type</span>
                    <select className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none">
                      <option className="bg-obsidian text-white">Bug / broken feature</option>
                      <option className="bg-obsidian text-white">Account or sign-in</option>
                      <option className="bg-obsidian text-white">Billing / membership</option>
                      <option className="bg-obsidian text-white">Safety or abuse</option>
                      <option className="bg-obsidian text-white">Other</option>
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/72">What happened</span>
                    <textarea
                      rows={5}
                      placeholder="Tell PHLEXR what happened, where it happened, and what you expected instead."
                      className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28"
                    />
                  </label>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                  >
                    Send report
                  </button>
                </form>
              </div>
            ) : null}
          </section>

          <aside className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.015))] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-gold/78">Account menu</p>
            <div className="mt-5 grid gap-4">
              {accountMenuSections.map((section) => (
                <div key={section.title} className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {section.title}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-[1rem] border px-3 py-3 text-sm font-semibold transition ${
                          item.href === page.href
                            ? "border-gold/35 bg-[linear-gradient(180deg,rgba(230,179,58,0.14),rgba(255,255,255,0.02))] text-gold"
                            : "border-white/10 bg-white/[0.03] text-white hover:border-gold/28 hover:text-gold"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
