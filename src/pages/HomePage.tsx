import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { company, projectOrder, projects, sectorOrder, serviceOrder, stepOrder, valueOrder } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { CtaSection } from "../components/ui/CtaSection";
import { Hero } from "../components/ui/Hero";
import { Note } from "../components/ui/Note";
import { PageMeta } from "../components/ui/PageMeta";
import { ProjectCard } from "../components/ui/ProjectCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ServiceCard } from "../components/ui/ServiceCard";
import { serviceIcons } from "../components/services/serviceIcons";

export function HomePage() {
  const { t } = useLanguage();
  const hero = projects["commercial-building-8th-mile"].images[0];

  return (
    <>
      <PageMeta title={t.meta.homeTitle} description={t.meta.homeDescription} />
      <Hero
        eyebrow={t.home.eyebrow}
        title={t.home.title}
        tagline={t.home.tagline}
        lede={t.home.lede}
        imageSrc={hero.src}
        imageAlt={t.projects.entries["commercial-building-8th-mile"].alts.frame}
        captionKicker={t.home.heroCaptionKicker}
        caption={t.home.heroCaption}
        actions={
          <>
            <Button to="/contact" variant="gold">
              {t.home.primaryCta}
            </Button>
            <Button to="/projects" variant="ghost">
              {t.home.secondaryCta}
            </Button>
          </>
        }
        facts={[
          { label: t.about.labels.constitution, value: t.home.factConstitution },
          { label: t.about.labels.experience, value: t.home.factExperience },
          { label: t.home.factGstin, value: company.gstin },
        ]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <SectionHeading
            index={t.home.overviewIndex}
            eyebrow={t.home.overviewEyebrow}
            title={t.home.overviewTitle}
          />
          <div className="space-y-4 text-base leading-relaxed text-ink/85">
            {t.home.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link to="/about" className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-navy">
              {t.home.overviewLink}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-sand py-16 sm:py-20">
        <Container>
          <SectionHeading index={t.home.servicesIndex} eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} lede={t.home.servicesLede} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOrder.map((id) => (
              <li key={id}>
                <ServiceCard
                  href={`/services#${id}`}
                  icon={serviceIcons[id]}
                  title={t.services.items[id].title}
                  body={t.services.items[id].body}
                />
              </li>
            ))}
          </ul>
          <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy">
            {t.home.servicesLink}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading index={t.home.sectorsIndex} eyebrow={t.home.sectorsEyebrow} title={t.home.sectorsTitle} lede={t.home.sectorsLede} />
          <div className="mt-8 overflow-x-auto border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy text-paper">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">{t.sectors.columnSector}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.sectors.columnRequirements}</th>
                </tr>
              </thead>
              <tbody>
                {sectorOrder.map((id, index) => (
                  <tr key={id} className={index % 2 === 0 ? "bg-paper" : "bg-sand/60"}>
                    <th scope="row" className="px-4 py-4 align-top font-medium text-navy">{t.sectors.items[id].title}</th>
                    <td className="px-4 py-4 leading-relaxed text-ink/80">{t.sectors.items[id].body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <Note>{t.services.note}</Note>
          </div>
        </Container>
      </section>

      <section className="bg-navy py-16 text-paper sm:py-20">
        <Container>
          <SectionHeading
            index={t.home.workIndex}
            eyebrow={t.home.workEyebrow}
            title={t.home.workTitle}
            lede={t.home.workLede}
            light
          />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {projectOrder.map((slug) => {
              const project = projects[slug];
              const copy = t.projects.entries[slug];
              return (
                <li key={slug}>
                  <ProjectCard
                    href={`/projects/${slug}`}
                    imageSrc={project.images[0].src}
                    imageAlt={copy.alts[project.images[0].id as keyof typeof copy.alts]}
                    year={project.year}
                    title={copy.title}
                    meta={`${project.client} · ${copy.location}`}
                    summary={copy.card}
                    action={t.home.viewProject}
                  />
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading index={t.home.approachIndex} eyebrow={t.home.approachEyebrow} title={t.home.approachTitle} />
            <Link to="/approach" className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              {t.home.approachLink}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {stepOrder.map((id, index) => (
              <li key={id} className="border-t-2 border-navy pt-4">
                <p className="font-display text-2xl text-gold-ink">0{index + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-navy">{t.approach.steps[id].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.approach.steps[id].body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-sand py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.values.eyebrow} title={t.values.title} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueOrder.map((id) => (
              <li key={id} className="bg-paper p-5">
                <h3 className="font-display text-2xl text-navy">{t.values[id].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.values[id].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        eyebrow={t.home.closeEyebrow}
        title={t.home.closeTitle}
        body={t.home.closeBody}
        action={<Button to="/contact" variant="gold">{t.home.closeCta}</Button>}
      />
    </>
  );
}
