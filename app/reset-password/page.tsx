"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import TurnstileWidget, { canUseTurnstile } from "@/components/auth/TurnstileWidget";
import { canUseSupabaseAuth, sendPasswordResetEmail } from "@/lib/supabase-auth";
import { PhlexrWordmark } from "@/components/brand/PhlexrLogo";

async function verifyCaptchaToken(token: string) {
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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetCount, setCaptchaResetCount] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter your email.");
      setSuccessMessage("");
      return;
    }

    if (!canUseSupabaseAuth()) {
      setError("Supabase auth is not configured.");
      setSuccessMessage("");
      return;
    }

    if (!canUseTurnstile()) {
      setError("Verification is unavailable right now.");
      setSuccessMessage("");
      return;
    }

    if (!captchaToken) {
      setError("Complete verification to continue.");
      setSuccessMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await verifyCaptchaToken(captchaToken);
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Verification failed. Try again."
      );
      setSuccessMessage("");
      setCaptchaToken("");
      setCaptchaResetCount((count) => count + 1);
      setLoading(false);
      return;
    }

    const { error: resetError } = await sendPasswordResetEmail({
      email: email.trim(),
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setSuccessMessage("");
      setCaptchaToken("");
      setCaptchaResetCount((count) => count + 1);
      setLoading(false);
      return;
    }

    setSuccessMessage("Reset link sent. Check your email.");
    setCaptchaToken("");
    setCaptchaResetCount((count) => count + 1);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-obsidian px-4 py-16 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-8">
          <PhlexrWordmark textClassName="text-xs uppercase tracking-[0.24em] text-gold/75" />
          <h1 className="mt-4 text-3xl font-semibold text-white">Reset password</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Enter your email and we&apos;ll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/72">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <TurnstileWidget
              resetKey={captchaResetCount}
              onVerify={(token: string) => {
                setCaptchaToken(token);
                setError("");
              }}
              onExpire={() => setCaptchaToken("")}
              onError={() => {
                setCaptchaToken("");
                setError("Verification failed. Try again.");
              }}
            />

            <p className="text-xs text-white/45">
              Verification helps prevent reset-email abuse without slowing down real users.
            </p>

            {error ? <p className="text-sm text-[#f0b4b4]">{error}</p> : null}
            {successMessage ? <p className="text-sm text-gold/85">{successMessage}</p> : null}
          </form>

          <Link href="/" className="mt-6 inline-flex text-sm text-white/58 transition hover:text-gold">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
