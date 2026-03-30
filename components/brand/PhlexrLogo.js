import Link from "next/link";

function TrademarkMark({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute right-0 top-0 translate-x-[78%] -translate-y-[10%] text-[0.38em] font-semibold uppercase leading-none tracking-normal text-gold/85 ${className}`}
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
  tmClassName = "",
  ariaLabel = "PHLEXR",
}) {
  const content = (
    <span className="relative inline-flex w-fit items-start">
      <img src="/phlexr-logo.png" alt="PHLEXR" className={imageClassName} />
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

  return content;
}
