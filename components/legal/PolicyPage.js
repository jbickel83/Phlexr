import Link from "next/link";
import { legalPageOrder, legalPages } from "@/lib/legal-content";

export default function PolicyPage({ slug }) {
  const page = legalPages[slug];

  if (!page) {
    return null;
  }

  const relatedPages = legalPageOrder.filter((entry) => entry !== slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-obsidian px-4 py-14 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex w-fit items-center" aria-label="PHLEXR">
              <img src="/phlexr-logo.png" alt="PHLEXR" className="h-10 w-auto sm:h-12" />
            </Link>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/app-shell"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
              >
                Back to account
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
              >
                Back to landing page
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-gold/78">{page.eyebrow}</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold text-white sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8">
            {page.intro}
          </p>

          <div className="mt-10 grid gap-5">
            {page.sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-[1.6rem] border border-white/8 bg-black/30 p-5 sm:p-6"
              >
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.heading}</h2>
                <div className="mt-4 grid gap-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-white/66 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-gold/16 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.015))] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold/78">More PHLEXR policies</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPages.map((entry) => (
              <Link
                key={entry}
                href={legalPages[entry].href}
                className="rounded-[1.2rem] border border-white/12 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition hover:border-gold/28 hover:text-gold"
              >
                {legalPages[entry].title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
