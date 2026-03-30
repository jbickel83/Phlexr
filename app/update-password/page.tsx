"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getCurrentSupabaseSession, updateSupabasePassword } from "@/lib/supabase-auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { PhlexrWordmark } from "@/components/brand/PhlexrLogo";

function getHashParams(hash: string) {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(value);
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseClient();

    async function prepareRecoverySession() {
      let recoverySession = null;
      const url = new URL(window.location.href);
      const tokenHash = url.searchParams.get("token_hash");
      const tokenType = url.searchParams.get("type");
      const queryAccessToken = url.searchParams.get("access_token");
      const queryRefreshToken = url.searchParams.get("refresh_token");

      if (tokenHash && tokenType === "recovery") {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (!active) {
          return;
        }

        if (verifyError) {
          setError(verifyError.message);
          return;
        }

        recoverySession = data?.session ?? null;
      }

      if (queryAccessToken && queryRefreshToken) {
        const { data, error: querySessionError } = await supabase.auth.setSession({
          access_token: queryAccessToken,
          refresh_token: queryRefreshToken,
        });

        if (!active) {
          return;
        }

        if (querySessionError) {
          setError(querySessionError.message);
          return;
        }

        recoverySession = data?.session ?? recoverySession;
      }

      if (window.location.hash) {
        const hashParams = getHashParams(window.location.hash);
        const hashAccessToken = hashParams.get("access_token");
        const hashRefreshToken = hashParams.get("refresh_token");

        if (hashAccessToken && hashRefreshToken) {
          const { data, error: hashSessionError } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          });

          if (!active) {
            return;
          }

          if (hashSessionError) {
            setError(hashSessionError.message);
            return;
          }

          recoverySession = data?.session ?? recoverySession;
        }
      }

      const { data, error: sessionError } = await getCurrentSupabaseSession();

      if (!active) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (recoverySession || data?.session) {
        window.history.replaceState({}, "", "/update-password");
        setError("");
        setReady(true);
        return;
      }

      setReady(false);
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
          <PhlexrWordmark textClassName="text-xs uppercase tracking-[0.24em] text-gold/75" />
          <h1 className="mt-4 text-3xl font-semibold text-white">Update password</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Set your new password to finish the reset.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white/72">New password</span>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="........"
                    disabled={Boolean(successMessage)}
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-white/28 focus:border-gold/35 disabled:cursor-not-allowed disabled:opacity-55"
                  />
                  <button
                    type="button"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                    disabled={Boolean(successMessage)}
                    className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-white/45 transition hover:text-gold disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {isPasswordVisible ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18m-7.9-3.2A8.8 8.8 0 0 1 12 18c-5 0-8.8-6-8.8-6a17 17 0 0 1 4.3-4.8m3-1.6A8.9 8.9 0 0 1 12 6c5 0 8.8 6 8.8 6a16.7 16.7 0 0 1-3.6 4.3M9.9 9.9a3 3 0 0 0 4.2 4.2"
                        />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.8 12S6.6 6 12 6s9.2 6 9.2 6-3.8 6-9.2 6S2.8 12 2.8 12Z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

            <button
              type="submit"
              disabled={loading || Boolean(successMessage)}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

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
