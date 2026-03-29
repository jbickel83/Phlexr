"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getCurrentSupabaseSession, updateSupabasePassword } from "@/lib/supabase-auth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseClient();

    async function prepareRecoverySession() {
      const { data, error: sessionError } = await getCurrentSupabaseSession();

      if (!active) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (data?.session) {
        setReady(true);
      }
    }

    prepareRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: unknown) => {
      if (!active) {
        return;
      }

      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setError("");
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setError("Enter a new password.");
      return;
    }

    if (!ready) {
      setError("Reset link is invalid or expired.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const { error: updateError } = await updateSupabasePassword(password);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccessMessage("Password updated. You can sign in now.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-obsidian px-4 py-16 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.95)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-gold/75">PHLEXR</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Update password</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Set your new password to finish the reset.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/72">New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="........"
                disabled={!ready || Boolean(successMessage)}
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35 disabled:cursor-not-allowed disabled:opacity-55"
              />
            </label>

            <button
              type="submit"
              disabled={!ready || loading || Boolean(successMessage)}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            {error ? <p className="text-sm text-[#f0b4b4]">{error}</p> : null}
            {successMessage ? <p className="text-sm text-gold/85">{successMessage}</p> : null}
          </form>

          <Link href="/app-shell" className="mt-6 inline-flex text-sm text-white/58 transition hover:text-gold">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
