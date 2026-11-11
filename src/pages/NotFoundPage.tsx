import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Container } from "../components/ui/Container";
import { PageMeta } from "../components/ui/PageMeta";

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta title={t.meta.notFoundTitle} description={t.notFound.body} />
      <section className="py-24">
        <Container className="max-w-xl">
          <h1 className="font-display text-4xl text-navy">{t.notFound.title}</h1>
          <p className="mt-4 leading-relaxed text-muted">{t.notFound.body}</p>
          <Link to="/" className="mt-6 inline-flex bg-navy px-5 py-3 text-sm font-medium text-paper">
            {t.notFound.home}
          </Link>
        </Container>
      </section>
    </>
  );
}
