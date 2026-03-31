"use client";

import { useEffect, useId, useRef } from "react";

const TURNSTILE_SCRIPT_ID = "phlexr-turnstile-script";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

function loadTurnstileScript(onLoad) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (window.turnstile) {
    onLoad();
    return () => {};
  }

  const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
  if (existingScript) {
    existingScript.addEventListener("load", onLoad);
    return () => existingScript.removeEventListener("load", onLoad);
  }

  const script = document.createElement("script");
  script.id = TURNSTILE_SCRIPT_ID;
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  script.addEventListener("load", onLoad);
  document.head.appendChild(script);

  return () => script.removeEventListener("load", onLoad);
}

export function canUseTurnstile() {
  return Boolean(TURNSTILE_SITE_KEY);
}

export default function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  resetKey = 0,
  className = "",
}) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef(null);
  const containerRef = useRef(null);
  const latestHandlersRef = useRef({ onVerify, onError, onExpire });

  latestHandlersRef.current = { onVerify, onError, onExpire };

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || typeof window === "undefined") {
      return;
    }

    function renderWidget() {
      if (!window.turnstile || widgetIdRef.current !== null || !containerRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        size: "normal",
        retry: "auto",
        "refresh-expired": "auto",
        callback(token) {
          latestHandlersRef.current.onVerify?.(token);
        },
        "expired-callback"() {
          latestHandlersRef.current.onExpire?.();
        },
        "error-callback"() {
          latestHandlersRef.current.onError?.();
        },
      });
    }

    const cleanupScriptListener = loadTurnstileScript(renderWidget);
    return cleanupScriptListener;
  }, []);

  useEffect(() => {
    if (widgetIdRef.current === null || typeof window === "undefined" || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-2 ${className}`}
    >
      <div id={containerId} ref={containerRef} className="min-h-[72px]" />
    </div>
  );
}
