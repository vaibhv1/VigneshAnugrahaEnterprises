import { useSearchParams } from "react-router-dom";
import {
  coverPhoto,
  extraPhotos,
  frameFor,
  projectCategories,
  projectOrder,
  projects,
  type ProjectCategory,
} from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { PhotoGrid } from "../components/media/PhotoGrid";
import { FeaturedProject } from "../components/projects/FeaturedProject";
import { ProjectFilters } from "../components/projects/ProjectFilters";
import { Container } from "../components/ui/Container";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";
import { ProjectCard } from "../components/ui/ProjectCard";
import { SectionHeading } from "../components/ui/SectionHeading";

function isCategory(value: string | null): value is ProjectCategory {
  return projectCategories.includes(value as ProjectCategory);
}

export function ProjectsPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const filter: ProjectCategory | "all" = isCategory(requested) ? requested : "all";
  const visible = projectOrder.filter((slug) => filter === "all" || projects[slug].category === filter);
  const [featured, ...rest] = visible;
  const photos = extraPhotos.map((photo) => ({
    src: photo.src,
    alt: t.projects.extraAlts[photo.id as keyof typeof t.projects.extraAlts],
    orientation: photo.orientation,
  }));

  function setFilter(next: ProjectCategory | "all") {
    setParams(next === "all" ? {} : { category: next });
  }

  return (
    <>
      <PageMeta title={t.meta.projectsTitle} description={t.meta.projectsDescription} />
      <PageBanner
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        lede={t.projects.lede}
        crumbs={[
          { label: t.nav.home, to: "/" },
          { label: t.nav.projects },
        ]}
      />
      <section className="bg-mist py-14 sm:py-16">
        <Container>
          <ProjectFilters value={filter} onChange={setFilter} />
          {featured ? (
            <div className="mt-8">
              <FeaturedEntry slug={featured} />
            </div>
          ) : null}
          {rest.length > 0 ? (
            <ul className="mt-6 grid gap-6">
              {rest.map((slug) => (
                <li key={slug}>
                  <ListingCard slug={slug} />
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>
      <section className="border-t border-line bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.projects.extraEyebrow} title={t.projects.extraTitle} lede={t.projects.extraLede} />
          <div className="mt-10">
            <PhotoGrid photos={photos} />
          </div>
        </Container>
      </section>
    </>
  );
}

function FeaturedEntry({ slug }: { slug: (typeof projectOrder)[number] }) {
  const { t } = useLanguage();
  const project = projects[slug];
  const copy = t.projects.entries[slug];
  const image = coverPhoto(project.images);

  return (
    <FeaturedProject
      href={`/projects/${slug}`}
      imageSrc={image.src}
      imageAlt={copy.alts[image.id as keyof typeof copy.alts]}
      orientation={image.orientation}
      category={t.projects.categories[project.category]}
      year={project.year}
      title={copy.title}
      client={project.client}
      location={copy.location}
      summary={copy.card}
      action={t.home.viewProject}
    />
  );
}

function ListingCard({ slug }: { slug: (typeof projectOrder)[number] }) {
  const { t } = useLanguage();
  const project = projects[slug];
  const copy = t.projects.entries[slug];
  const image = coverPhoto(project.images);
  const frame = frameFor(image.orientation);
  const imageClassName =
    image.orientation === "portrait"
      ? `${frame.aspect} w-full shrink-0 sm:w-72 lg:w-80`
      : `${frame.aspect} w-full shrink-0 lg:w-[46%]`;

  return (
    <ProjectCard
      href={`/projects/${slug}`}
      layout="horizontal"
      imageSrc={image.src}
      imageAlt={copy.alts[image.id as keyof typeof copy.alts]}
      imagePosition={frame.position}
      imageClassName={imageClassName}
      year={project.year}
      category={t.projects.categories[project.category]}
      title={copy.title}
      meta={`${project.client} · ${copy.location}`}
      summary={copy.card}
      action={t.home.viewProject}
      titleAs="h2"
    />
  );
}
