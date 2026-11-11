import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { PageMeta } from "../components/ui/PageMeta";

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta title={t.meta.notFoundTitle} description={t.notFound.body} />
      <section className="bg-navy py-20 text-white sm:py-28">
        <Container className="max-w-xl">
          <div className="h-px w-14 bg-gold" aria-hidden="true" />
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{t.notFound.title}</h1>
          <p className="mt-4 leading-relaxed text-white/80">{t.notFound.body}</p>
          <div className="mt-8">
            <Button to="/" variant="gold">
              {t.notFound.home}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
