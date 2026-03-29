"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { updateSupabasePassword } from "@/lib/supabase-auth";

function readHashParams(hash: string) {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(value);
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function prepareRecoverySession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        } else if (window.location.hash) {
          const hashParams = readHashParams(window.location.hash);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              throw sessionError;
            }
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Reset link is invalid or expired.");
        }

        if (active) {
          window.history.replaceState({}, "", "/update-password");
          setReady(true);
        }
      } catch (sessionError) {
        if (active) {
          setError(
            sessionError instanceof Error ? sessionError.message : "Reset link is invalid or expired."
          );
        }
      }
    }

    prepareRecoverySession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setError("Enter a new password.");
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
