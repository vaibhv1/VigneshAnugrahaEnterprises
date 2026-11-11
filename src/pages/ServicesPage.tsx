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
      <section className="bg-mist py-20 sm:py-24">
        <Container className="grid gap-5">
          {serviceOrder.map((id, index) => {
            const Icon = serviceIcons[id];
            const item = t.services.items[id];
            return (
              <article id={id} key={id} className="scroll-mt-32 border border-line bg-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center bg-mist text-navy">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-lg text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-6 font-display text-3xl text-navy">{item.title}</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-ink/85">{item.body}</p>
              </article>
            );
          })}
          <Note>{t.services.note}</Note>
        </Container>
      </section>
    </>
  );
}
