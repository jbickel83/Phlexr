"use client";

import Link from "next/link";
import { PhlexrWordmark } from "@/components/brand/PhlexrLogo";

export default function RecoverAccountPage() {
  return (
    <main className="min-h-screen bg-obsidian px-4 py-16 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-8">
          <PhlexrWordmark textClassName="text-xs uppercase tracking-[0.24em] text-gold/75" />
          <h1 className="mt-4 text-3xl font-semibold text-white">Forgot email or username</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            PHLEXR sign in uses your email address, not your username.
          </p>

          <div className="mt-8 grid gap-4 text-sm leading-7 text-white/68">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-white">If you forgot your username</p>
              <p className="mt-2">
                Your username is only used for your public PHLEXR profile. Try checking your signup
                or welcome emails, your shared profile link, or any screenshots of your profile.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-white">If you forgot your email</p>
              <p className="mt-2">
                Try the email addresses you normally use with PHLEXR, then use password reset on the
                correct one. For privacy and security, PHLEXR does not show account email addresses
                on this screen.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-gold/18 bg-[linear-gradient(180deg,rgba(230,179,58,0.08),rgba(255,255,255,0.02))] p-4">
              <p className="font-semibold text-white">Next steps</p>
              <div className="mt-3 grid gap-3">
                <Link
                  href="/reset-password"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian"
                >
                  Reset password
                </Link>
                <a
                  href="mailto:phlexrapp@gmail.com?subject=PHLEXR%20Account%20Recovery"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold/30 hover:text-gold"
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>

          <Link href="/" className="mt-6 inline-flex text-sm text-white/58 transition hover:text-gold">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
