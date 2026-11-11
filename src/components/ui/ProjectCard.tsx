import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CoverImage } from "../media/CoverImage";

export function ProjectCard({
  href,
  imageSrc,
  imageAlt,
  imagePosition = "center 32%",
  year,
  title,
  meta,
  summary,
  action,
  layout = "stack",
  titleAs = "h3",
}: {
  href: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  year: string;
  title: string;
  meta: string;
  summary: string;
  action: string;
  layout?: "stack" | "horizontal";
  titleAs?: "h2" | "h3";
}) {
  const Title = titleAs;
  const horizontal = layout === "horizontal";

  return (
    <Link
      to={href}
      className={`group flex h-full overflow-hidden border border-line bg-white transition duration-200 hover:border-gold motion-reduce:transition-none ${
        horizontal ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <CoverImage
        src={imageSrc}
        alt={imageAlt}
        objectPosition={imagePosition}
        className={horizontal ? "aspect-[4/3] w-full lg:w-[52%]" : "aspect-[4/3] w-full"}
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{year}</p>
        <Title className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">{title}</Title>
        <p className="mt-2 text-sm text-muted">{meta}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/85">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          {action}
          <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
