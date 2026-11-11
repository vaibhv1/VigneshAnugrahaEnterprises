export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  light = false,
  as = "h2",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  light?: boolean;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className="max-w-2xl">
      <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "text-gold" : "text-navy"}`}>
        <span className="h-px w-8 bg-gold" aria-hidden="true" />
        {index ? (
          <span className={`font-display text-lg normal-case tracking-normal ${light ? "text-gold" : "text-gold-ink"}`}>
            {index}
          </span>
        ) : null}
        <span>{eyebrow}</span>
      </p>
      <Heading className={`mt-3 font-display text-3xl leading-[1.2] sm:text-4xl ${light ? "text-white" : "text-navy"}`}>
        {title}
      </Heading>
      {lede ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/80" : "text-muted"}`}>{lede}</p>
      ) : null}
    </div>
  );
}
