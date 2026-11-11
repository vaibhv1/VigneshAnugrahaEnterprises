import { useParams } from "react-router-dom";
import {
  coverPhoto,
  frameFor,
  maintenanceScopeOrder,
  projectOrder,
  projects,
  type ProjectSlug,
} from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { CoverImage } from "../components/media/CoverImage";
import { PhotoGrid } from "../components/media/PhotoGrid";
import { ProjectPager } from "../components/projects/ProjectPager";
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
  const leadAlt = copy.alts[lead.id as keyof typeof copy.alts];
  const leadFrame = frameFor(lead.orientation);
  const further = project.images
    .filter((image) => image.src !== lead.src)
    .map((image) => ({
      src: image.src,
      alt: copy.alts[image.id as keyof typeof copy.alts],
      orientation: image.orientation,
    }));

  const facts = [
    { label: t.projects.category, value: t.projects.categories[project.category] },
    { label: t.projects.client, value: project.client },
    { label: t.projects.location, value: copy.location },
    { label: t.projects.year, value: project.year },
    project.plotArea ? { label: t.projects.plotArea, value: project.plotArea } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <>
      <PageMeta title={`${copy.title} | ${t.meta.projectTitleSuffix}`} description={copy.summary} />
      <section className="border-b border-line bg-mist">
        <Container className="py-10 sm:py-14">
          <Breadcrumb
            items={[
              { label: t.nav.home, to: "/" },
              { label: t.nav.projects, to: "/projects" },
              { label: copy.title },
            ]}
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">
            {t.projects.categories[project.category]} · {project.year}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/80">{copy.summary}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t-2 border-navy pt-3">
                <dt className="text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                <dd className="mt-1 text-navy">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <h2 className="font-display text-3xl text-navy">{t.projects.scopeLabel}</h2>
            {slug === "maintenance-vibgyor" ? (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {maintenanceScopeOrder.map((id) => (
                  <li key={id} className="py-3 text-ink/85">
                    {t.projects.maintenanceScope[id]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-ink/85">{copy.scope}</p>
            )}
            <div className="mt-6">
              <Note>{t.projects.limited}</Note>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-navy">{t.projects.photographs}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.projects.photoDisclaimer}</p>
            <figure className="mt-6">
              <CoverImage
                src={lead.src}
                alt={leadAlt}
                objectPosition={leadFrame.position}
                loading="eager"
                fetchPriority="high"
                className={`${leadFrame.aspect} w-full ${lead.orientation === "portrait" ? "max-w-md" : ""}`}
              />
              <figcaption className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{leadAlt}</figcaption>
            </figure>
            {further.length > 0 ? (
              <div className="mt-8">
                <PhotoGrid photos={further} />
              </div>
            ) : null}
          </div>
        </Container>
      </section>
      <ProjectPager previous={previous} next={next} />
    </>
  );
}
