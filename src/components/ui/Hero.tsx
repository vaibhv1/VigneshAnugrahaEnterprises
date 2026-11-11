import type { ReactNode } from "react";
import { Container } from "./Container";

export type HeroFact = {
  label: string;
  value: string;
};

export function Hero({
  eyebrow,
  title,
  tagline,
  lede,
  imageSrc,
  imageAlt,
  captionKicker,
  caption,
  actions,
  facts,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
  captionKicker: string;
  caption: string;
  actions: ReactNode;
  facts?: HeroFact[];
}) {
  return (
    <section className="bg-navy text-white">
      <div className="grid lg:min-h-[640px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Container className="flex flex-col justify-center py-14 lg:max-w-none lg:px-12 lg:py-20 xl:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.12] sm:text-5xl">{title}</h1>
          <p className="mt-4 font-display text-2xl text-gold">{tagline}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
          {facts && facts.length > 0 ? (
            <dl className="mt-10 grid max-w-xl gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-wider text-white/55">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
        <figure className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full">
          <img
            src={imageSrc}
            alt={imageAlt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/80 to-transparent p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{captionKicker}</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white">{caption}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
