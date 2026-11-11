import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  coverPhoto,
  maintenanceScopeOrder,
  projectOrder,
  projects,
  type ProjectSlug,
} from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { CoverImage } from "../components/media/CoverImage";
import { PhotoGrid } from "../components/media/PhotoGrid";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Container } from "../components/ui/Container";
import { Note } from "../components/ui/Note";
import { PageMeta } from "../components/ui/PageMeta";
import { NotFoundPage } from "./NotFoundPage";

function isSlug(value: string): value is ProjectSlug {
  return (projectOrder as string[]).includes(value);
}

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const { t } = useLanguage();

  if (!isSlug(slug)) return <NotFoundPage />;

  const project = projects[slug];
  const copy = t.projects.entries[slug];
  const index = projectOrder.indexOf(slug);
  const previous = index > 0 ? projectOrder[index - 1] : null;
  const next = index < projectOrder.length - 1 ? projectOrder[index + 1] : null;
  const lead = coverPhoto(project.images);
  const photos = project.images.map((image) => ({
    src: image.src,
    alt: copy.alts[image.id as keyof typeof copy.alts],
  }));

  const facts = [
    { label: t.projects.client, value: project.client },
    { label: t.projects.location, value: copy.location },
    { label: t.projects.year, value: project.year },
    project.plotArea ? { label: t.projects.plotArea, value: project.plotArea } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <>
      <PageMeta
        title={`${copy.title} | ${t.meta.projectTitleSuffix}`}
        description={copy.summary}
      />
      <section className="border-b border-line bg-mist">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Container className="py-10 sm:py-14 lg:max-w-none lg:px-12 lg:py-16">
          <Breadcrumb
            items={[
              { label: t.nav.home, to: "/" },
              { label: t.nav.projects, to: "/projects" },
              { label: copy.title },
            ]}
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{project.year}</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl text-navy sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/80">{copy.summary}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t-2 border-navy pt-3">
                <dt className="text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                <dd className="mt-1 text-navy">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
        <CoverImage
          src={lead.src}
          alt={copy.alts[lead.id as keyof typeof copy.alts]}
          objectPosition={lead.orientation === "landscape" ? "center" : "center 32%"}
          className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[28rem]"
        />
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="font-display text-3xl text-navy">{t.projects.scopeLabel}</h2>
            {slug === "maintenance-vibgyor" ? (
              <ul className="mt-4 space-y-2">
                {maintenanceScopeOrder.map((id) => (
                  <li key={id} className="border-b border-line py-2">
                    {t.projects.maintenanceScope[id]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-relaxed">{copy.scope}</p>
            )}
            <div className="mt-6">
              <Note>{t.projects.limited}</Note>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-navy">{t.projects.photographs}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.projects.photoDisclaimer}</p>
            <div className="mt-6">
              <PhotoGrid photos={photos} />
            </div>
          </div>
        </Container>
      </section>
      <nav className="border-t border-line" aria-label={t.nav.projects}>
        <Container className="grid gap-4 py-6 sm:grid-cols-2">
          {previous ? (
            <Link to={`/projects/${previous}`} className="text-sm font-medium text-navy">
              <span className="block text-xs uppercase tracking-wider text-muted">{t.projects.previous}</span>
              {t.projects.entries[previous].title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/projects/${next}`} className="text-sm font-medium text-navy sm:text-right">
              <span className="block text-xs uppercase tracking-wider text-muted">{t.projects.next}</span>
              <span className="inline-flex items-center gap-2">
                {t.projects.entries[next].title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ) : null}
        </Container>
      </nav>
    </>
  );
}
