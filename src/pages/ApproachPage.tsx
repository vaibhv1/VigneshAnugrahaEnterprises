import {
  documentOrder,
  engagementOrder,
  environmentOrder,
  qualityOrder,
  safetyOrder,
} from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { Container } from "../components/ui/Container";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";
import { ProcessTimeline } from "../components/ui/ProcessTimeline";
import { SectionHeading } from "../components/ui/SectionHeading";

export function ApproachPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta title={t.meta.approachTitle} description={t.meta.approachDescription} />
      <PageBanner
        eyebrow={t.approach.eyebrow}
        title={t.approach.title}
        lede={t.approach.lede}
        crumbs={[
          { label: t.nav.home, to: "/" },
          { label: t.nav.approach },
        ]}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <ProcessTimeline titleAs="h2" />
        </Container>
      </section>

      <section className="bg-sand py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t.approach.documentsEyebrow} title={t.approach.documentsTitle} />
            <ul className="mt-6 space-y-3">
              {documentOrder.map((id) => (
                <li key={id} className="border-l-2 border-gold pl-4 leading-relaxed">
                  {t.approach.documents[id]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow={t.approach.engagementEyebrow} title={t.approach.engagementTitle} lede={t.approach.engagementLede} />
            <ol className="mt-6 space-y-4">
              {engagementOrder.map((id, index) => (
                <li key={id} className="flex gap-3 leading-relaxed">
                  <span className="font-semibold text-gold-ink">{index + 1}.</span>
                  <span>{t.approach.engagement[id]}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={t.approach.commitmentEyebrow}
            title={t.approach.commitmentTitle}
            lede={t.approach.commitmentLede}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="border border-line p-5">
              <h3 className="font-display text-2xl text-navy">{t.approach.qualityTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/85">
                {qualityOrder.map((id) => (
                  <li key={id}>{t.approach.quality[id]}</li>
                ))}
              </ul>
            </article>
            <article className="border border-line bg-navy p-5 text-paper">
              <h3 className="font-display text-2xl">{t.approach.safetyTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-paper/80">
                {safetyOrder.map((id) => (
                  <li key={id}>{t.approach.safety[id]}</li>
                ))}
              </ul>
            </article>
            <article className="border border-line p-5">
              <h3 className="font-display text-2xl text-navy">{t.approach.environmentTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/85">
                {environmentOrder.map((id) => (
                  <li key={id}>{t.approach.environment[id]}</li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-navy">{t.approach.commitmentClose}</p>
        </Container>
      </section>
    </>
  );
}
