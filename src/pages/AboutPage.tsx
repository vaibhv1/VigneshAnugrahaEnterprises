import { company, strengthOrder, valueOrder } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { Container } from "../components/ui/Container";
import { Note } from "../components/ui/Note";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";
import { SectionHeading } from "../components/ui/SectionHeading";

export function AboutPage() {
  const { t } = useLanguage();
  const rows = [
    { label: t.about.labels.businessName, value: company.legalName },
    { label: t.about.labels.constitution, value: t.about.constitution },
    { label: t.about.labels.location, value: t.about.location },
    { label: t.about.labels.experience, value: t.about.experience },
    { label: t.about.labels.proprietor, value: company.proprietor },
    { label: t.about.labels.gstin, value: company.gstin },
    { label: t.about.labels.address, value: t.about.address },
    { label: t.about.labels.phone, value: company.phoneDisplay, href: `tel:${company.phoneTel}` },
    { label: t.about.labels.email, value: company.email, href: `mailto:${company.email}` },
  ];

  return (
    <>
      <PageMeta title={t.meta.aboutTitle} description={t.meta.aboutDescription} />
      <PageBanner
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        lede={t.about.lede}
        crumbs={[
          { label: t.nav.home, to: "/" },
          { label: t.nav.about },
        ]}
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-4 text-base leading-relaxed">
          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Container>
      </section>
      <section className="border-y border-line bg-sand py-16 sm:py-20">
        <Container className="grid gap-5 lg:grid-cols-2">
          <article className="bg-paper p-6 sm:p-8">
            <h2 className="font-display text-3xl text-navy">{t.vision.title}</h2>
            <p className="mt-4 leading-relaxed text-ink/85">{t.vision.body}</p>
          </article>
          <article className="bg-navy p-6 text-paper sm:p-8">
            <h2 className="font-display text-3xl">{t.mission.title}</h2>
            <p className="mt-4 leading-relaxed text-paper/80">{t.mission.body}</p>
          </article>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.values.eyebrow} title={t.values.title} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valueOrder.map((id, index) => (
              <li key={id} className="border border-line border-t-2 border-t-gold bg-white p-6">
                <p className="font-display text-lg text-gold-ink">0{index + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-navy">{t.values[id].title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.values[id].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="bg-sand py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={t.strengths.eyebrow} title={t.strengths.title} />
          <ol className="space-y-4">
            {strengthOrder.map((id, index) => (
              <li key={id} className="flex gap-4 border-b border-line pb-4">
                <span className="font-display text-xl text-gold-ink">0{index + 1}</span>
                <p className="leading-relaxed">{t.strengths.items[id]}</p>
              </li>
            ))}
          </ol>
        </Container>
        <Container className="mt-8">
          <Note>{t.services.note}</Note>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.about.particularsEyebrow} title={t.about.particularsTitle} />
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                <dt className="text-sm font-medium text-muted">{row.label}</dt>
                <dd className="text-navy">
                  {row.href ? (
                    <a href={row.href} className="underline decoration-gold underline-offset-4">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <Note>{t.about.experienceNote}</Note>
          </div>
        </Container>
      </section>
    </>
  );
}
