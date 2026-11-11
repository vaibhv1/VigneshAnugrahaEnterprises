import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Building2, Factory, GraduationCap, House } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { company, coverPhoto, projectOrder, projects, sectorOrder, serviceOrder, valueOrder } from "../data/site";
import type { SectorId } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { CoverImage } from "../components/media/CoverImage";
import { CtaSection } from "../components/ui/CtaSection";
import { Hero } from "../components/ui/Hero";
import { Note } from "../components/ui/Note";
import { PageMeta } from "../components/ui/PageMeta";
import { ProjectCard } from "../components/ui/ProjectCard";
import { ProcessTimeline } from "../components/ui/ProcessTimeline";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ServiceCard } from "../components/ui/ServiceCard";
import { serviceIcons } from "../components/services/serviceIcons";

const sectorIcons: Record<SectorId, LucideIcon> = {
  education: GraduationCap,
  commercial: Building2,
  residential: House,
  industrial: Factory,
  builders: Briefcase,
};

export function HomePage() {
  const { t } = useLanguage();
  const hero = projects["commercial-building-8th-mile"].images[0];
  const intro = projects["residential-dasarahalli"];
  const introCopy = t.projects.entries["residential-dasarahalli"];

  return (
    <>
      <PageMeta title={t.meta.homeTitle} description={t.meta.homeDescription} />
      <Hero
        eyebrow={t.home.eyebrow}
        title={t.home.title}
        headline={t.home.tagline}
        lede={t.home.lede}
        imageSrc={hero.src}
        imageAlt={t.projects.entries["commercial-building-8th-mile"].alts.frame}
        captionKicker={t.home.heroCaptionKicker}
        caption={t.home.heroCaption}
        actions={
          <>
            <Button to="/services" variant="gold">
              {t.home.primaryCta}
            </Button>
            <Button to="/projects" variant="ghost">
              {t.home.secondaryCta}
            </Button>
          </>
        }
      />

      <section className="border-b border-line bg-white">
        <Container>
          <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: t.about.labels.constitution, value: t.home.factConstitution },
              { label: t.about.labels.experience, value: t.home.factExperience },
              { label: t.home.factGstin, value: company.gstin },
            ].map((fact) => (
              <div key={fact.label} className="py-6 sm:px-6 sm:py-8 sm:first:pl-0 sm:last:pr-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{fact.label}</dt>
                <dd className="mt-2 font-display text-2xl text-navy">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <SectionHeading
              index={t.home.overviewIndex}
              eyebrow={t.home.overviewEyebrow}
              title={t.home.overviewTitle}
            />
            <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-ink/85">
              {t.home.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy">
              {t.home.overviewLink}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <figure>
            <CoverImage
              src={intro.images[0].src}
              alt={introCopy.alts.masonry}
              objectPosition="center 42%"
              className="aspect-[4/5] w-full"
            />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-3 text-sm">
              <span className="font-semibold text-navy">{introCopy.title}</span>
              <span className="text-muted">
                {introCopy.location} · {intro.year}
              </span>
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-y border-line bg-mist py-20 sm:py-28">
        <Container>
          <SectionHeading
            index={t.home.servicesIndex}
            eyebrow={t.home.servicesEyebrow}
            title={t.home.servicesTitle}
            lede={t.home.servicesLede}
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOrder.map((id, index) => (
              <li key={id} className="h-full">
                <ServiceCard
                  href={`/services#${id}`}
                  icon={serviceIcons[id]}
                  index={String(index + 1).padStart(2, "0")}
                  title={t.services.items[id].title}
                  body={t.services.items[id].body}
                />
              </li>
            ))}
          </ul>
          <Link to="/services" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-navy">
            {t.home.servicesLink}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            index={t.home.workIndex}
            eyebrow={t.home.workEyebrow}
            title={t.home.workTitle}
            lede={t.home.workLede}
          />
          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {projectOrder.map((slug, index) => {
              const project = projects[slug];
              const copy = t.projects.entries[slug];
              const image = coverPhoto(project.images);
              return (
                <li key={slug} className={index === 0 ? "lg:col-span-2" : undefined}>
                  <ProjectCard
                    href={`/projects/${slug}`}
                    layout={index === 0 ? "horizontal" : "stack"}
                    imageSrc={image.src}
                    imageAlt={copy.alts[image.id as keyof typeof copy.alts]}
                    imagePosition={image.orientation === "landscape" ? "center" : "center 32%"}
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

      <section className="border-y border-line bg-mist py-20 sm:py-28">
        <Container>
          <SectionHeading
            index={t.home.sectorsIndex}
            eyebrow={t.home.sectorsEyebrow}
            title={t.home.sectorsTitle}
            lede={t.home.sectorsLede}
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectorOrder.map((id) => {
              const Icon = sectorIcons[id];
              return (
                <li key={id} className="flex h-full flex-col border border-line bg-white p-6">
                  <span className="grid h-12 w-12 place-items-center bg-navy text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-navy">{t.sectors.items[id].title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{t.sectors.items[id].body}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <Note>{t.services.note}</Note>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading index={t.home.approachIndex} eyebrow={t.home.approachEyebrow} title={t.home.approachTitle} />
            <Link to="/approach" className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              {t.home.approachLink}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12">
            <ProcessTimeline />
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-mist py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={t.values.eyebrow} title={t.values.title} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valueOrder.map((id, index) => (
              <li key={id} className="border border-line border-t-2 border-t-gold bg-white p-6">
                <p className="font-display text-lg text-gold-ink">0{index + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-navy">{t.values[id].title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.values[id].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        eyebrow={t.home.closeEyebrow}
        title={t.home.closeTitle}
        body={t.home.closeBody}
        action={
          <>
            <Button to="/contact" variant="gold">
              {t.home.closeCta}
            </Button>
            <Button href={`tel:${company.phoneTel}`} variant="ghost">
              {company.phoneDisplay}
            </Button>
          </>
        }
      />
    </>
  );
}
