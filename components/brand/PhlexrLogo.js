"use client";

import Link from "next/link";
import { useState } from "react";

function TrademarkMark({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute right-0 top-0 translate-x-[62%] -translate-y-[28%] text-[0.24em] font-semibold uppercase leading-none tracking-[-0.02em] text-gold/65 ${className}`}
    >
      TM
    </span>
  );
}

export function PhlexrWordmark({
  as: Component = "span",
  href = undefined,
  className = "",
  textClassName = "",
  tmClassName = "",
  ariaLabel = "PHLEXR",
}) {
  const content = (
    <span className={`relative inline-flex w-fit items-start ${className}`}>
      <span className={textClassName}>PHLEXR</span>
      <TrademarkMark className={tmClassName} />
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className="inline-flex w-fit items-center">
        {content}
      </Link>
    );
  }

  return <Component aria-label={ariaLabel}>{content}</Component>;
}

export function PhlexrImageLogo({
  href = undefined,
  imageClassName = "h-10 w-auto sm:h-12",
  fallbackTextClassName = "font-display text-lg tracking-[0.26em] text-gold sm:text-xl sm:tracking-[0.35em]",
  tmClassName = "",
  ariaLabel = "PHLEXR",
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const content = (
    <span className="relative inline-flex w-fit items-start">
      {hasImageError ? (
        <>
          <span className={fallbackTextClassName}>PHLEXR</span>
          <TrademarkMark className={tmClassName} />
        </>
      ) : (
        <>
          <img
            src="/phlexr-logo.png"
            alt="PHLEXR"
            className={imageClassName}
            onError={() => setHasImageError(true)}
          />
          <TrademarkMark className={tmClassName} />
        </>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className="inline-flex w-fit items-center">
        {content}
      </Link>
    );
  }

  return content;
}
