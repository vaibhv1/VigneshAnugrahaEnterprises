import type { ReactNode } from "react";
import { Container } from "./Container";

export function CtaSection({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <section className="bg-navy text-white">
      <Container className="max-w-4xl py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{action}</div>
      </Container>
    </section>
  );
}
