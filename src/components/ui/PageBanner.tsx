import { Container } from "./Container";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export function PageBanner({
  eyebrow,
  title,
  lede,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-14 sm:py-20">
        {crumbs ? <Breadcrumb items={crumbs} tone="dark" /> : null}
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-gold ${crumbs ? "mt-6" : ""}`}>
          {eyebrow}
        </p>
        <div className="mt-4 h-px w-14 bg-gold" aria-hidden="true" />
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.12] sm:text-5xl">{title}</h1>
        {lede ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{lede}</p> : null}
      </Container>
    </section>
  );
}
