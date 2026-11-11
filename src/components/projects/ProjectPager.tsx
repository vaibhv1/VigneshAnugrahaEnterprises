import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, type ProjectSlug } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";

export function ProjectPager({
  previous,
  next,
}: {
  previous: ProjectSlug | null;
  next: ProjectSlug | null;
}) {
  const { t } = useLanguage();

  return (
    <nav className="border-t border-line bg-mist" aria-label={t.projects.pagerLabel}>
      <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-3">
        {previous ? (
          <Link to={`/projects/${previous}`} className="bg-white px-5 py-6 hover:bg-mist sm:px-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t.projects.previous}
            </span>
            <span className="mt-2 block font-display text-2xl text-navy">{t.projects.entries[previous].title}</span>
            <span className="mt-1 block text-sm text-muted">{t.projects.categories[projects[previous].category]}</span>
          </Link>
        ) : (
          <span className="hidden bg-white sm:block" />
        )}
        <Link to="/projects" className="bg-white px-5 py-6 text-left hover:bg-mist sm:px-8 sm:text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{t.projects.back}</span>
          <span className="mt-2 block font-display text-2xl text-navy">{t.nav.projects}</span>
        </Link>
        {next ? (
          <Link to={`/projects/${next}`} className="bg-white px-5 py-6 hover:bg-mist sm:px-8 sm:text-right">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:justify-end">
              {t.projects.next}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="mt-2 block font-display text-2xl text-navy">{t.projects.entries[next].title}</span>
            <span className="mt-1 block text-sm text-muted">{t.projects.categories[projects[next].category]}</span>
          </Link>
        ) : (
          <span className="hidden bg-white sm:block" />
        )}
      </div>
    </nav>
  );
}
