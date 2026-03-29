"use client";

import { useEffect } from "react";
import {
  canUseSupabaseAuth,
  getCurrentSupabaseSession,
  initializeSupabaseSessionFromUrl,
  subscribeToSupabaseAuthChanges,
} from "@/lib/supabase-auth";

export default function SupabaseAuthSync() {
  useEffect(() => {
    if (!canUseSupabaseAuth()) {
      return;
    }

    let active = true;

    async function syncSession() {
      const { data: initializedData, error: initializedError } =
        await initializeSupabaseSessionFromUrl();

      let data = initializedData;
      let error = initializedError;

      if (!data?.session && !error) {
        const currentSessionResult = await getCurrentSupabaseSession();
        data = currentSessionResult.data;
        error = currentSessionResult.error;
      }

      if (!active) {
        return;
      }

      console.log("[PHLEXR auth] session on load", data?.session ?? null);
      console.log("[PHLEXR auth] session load data", data);
      console.log("[PHLEXR auth] session load error", error);

      if (error) {
        console.error("[PHLEXR auth] session load error", error);
      }
    }

    syncSession();

    const {
      data: { subscription },
    } = subscribeToSupabaseAuthChanges((event: string, session: unknown) => {
      if (!active) {
        return;
      }

      console.log("AUTH EVENT:", event);
      console.log("SESSION:", session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
