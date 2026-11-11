import { serviceOrder } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { serviceIcons } from "../components/services/serviceIcons";
import { Container } from "../components/ui/Container";
import { Note } from "../components/ui/Note";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";

export function ServicesPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta title={t.meta.servicesTitle} description={t.meta.servicesDescription} />
      <PageBanner
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        lede={t.services.lede}
        crumbs={[
          { label: t.nav.home, to: "/" },
          { label: t.nav.services },
        ]}
      />
      <section className="py-14 sm:py-16">
        <Container className="space-y-4">
          {serviceOrder.map((id, index) => {
            const Icon = serviceIcons[id];
            const item = t.services.items[id];
            return (
              <article id={id} key={id} className="scroll-mt-32 grid gap-4 border border-line p-5 sm:grid-cols-[auto_1fr] sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="font-display text-2xl text-gold-ink">0{index + 1}</span>
                  <Icon className="mt-1 h-5 w-5 text-navy" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-navy">{item.title}</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-ink/85">{item.body}</p>
                </div>
              </article>
            );
          })}
          <Note>{t.services.note}</Note>
        </Container>
      </section>
    </>
  );
}
