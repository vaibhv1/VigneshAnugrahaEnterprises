import type { ReactNode } from "react";
import { CoverImage } from "../media/CoverImage";
import { Container } from "./Container";

export function Hero({
  eyebrow,
  title,
  headline,
  lede,
  imageSrc,
  imageAlt,
  captionKicker,
  caption,
  actions,
}: {
  eyebrow: string;
  title: string;
  headline: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
  captionKicker: string;
  caption: string;
  actions: ReactNode;
}) {
  return (
    <section className="bg-navy text-white">
      <div className="grid lg:min-h-[40rem] lg:grid-cols-2">
        <Container className="flex flex-col justify-center py-16 lg:max-w-none lg:px-12 lg:py-20 xl:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
          <p className="mt-5 text-sm font-medium tracking-wide text-white/75">{title}</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.08] sm:text-5xl xl:text-6xl">{headline}</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">{lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
        </Container>
        <figure className="relative min-h-[22rem] border-t border-white/10 lg:min-h-full lg:border-t-0 lg:border-l lg:border-white/10">
          <div className="absolute inset-0">
            <CoverImage
              src={imageSrc}
              alt={imageAlt}
              loading="eager"
              fetchPriority="high"
              objectPosition="center 30%"
              className="h-full w-full"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-navy-deep px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{captionKicker}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-white/85">{caption}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
