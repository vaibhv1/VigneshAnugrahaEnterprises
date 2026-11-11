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
      <Container className="max-w-3xl py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{title}</h2>
        <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">{body}</p>
        <div className="mt-8">{action}</div>
      </Container>
    </section>
  );
}
