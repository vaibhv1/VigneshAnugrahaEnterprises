import { coverPhoto, extraPhotos, projectOrder, projects } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { PhotoGrid } from "../components/media/PhotoGrid";
import { Container } from "../components/ui/Container";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";
import { ProjectCard } from "../components/ui/ProjectCard";
import { SectionHeading } from "../components/ui/SectionHeading";

export function ProjectsPage() {
  const { t } = useLanguage();
  const photos = extraPhotos.map((photo) => ({
    src: photo.src,
    alt: t.projects.extraAlts[photo.id as keyof typeof t.projects.extraAlts],
  }));

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
        <Container className="grid gap-6">
          {projectOrder.map((slug) => {
            const project = projects[slug];
            const copy = t.projects.entries[slug];
            const image = coverPhoto(project.images);
            return (
              <ProjectCard
                key={slug}
                layout="horizontal"
                href={`/projects/${slug}`}
                imageSrc={image.src}
                imageAlt={copy.alts[image.id as keyof typeof copy.alts]}
                imagePosition={image.orientation === "landscape" ? "center" : "center 32%"}
                year={project.year}
                title={copy.title}
                meta={`${project.client} · ${copy.location}`}
                summary={copy.summary}
                action={t.home.viewProject}
                titleAs="h2"
              />
            );
          })}
        </Container>
      </section>
      <section className="border-t border-line bg-sand py-16 sm:py-20">
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
