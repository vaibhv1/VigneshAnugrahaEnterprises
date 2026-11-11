import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { frameFor, type Photo } from "../../data/site";
import { CoverImage } from "../media/CoverImage";
import { cn } from "../../lib/cn";

export function FeaturedProject({
  href,
  imageSrc,
  imageAlt,
  orientation,
  category,
  year,
  title,
  client,
  location,
  summary,
  action,
}: {
  href: string;
  imageSrc: string;
  imageAlt: string;
  orientation: Photo["orientation"];
  category: string;
  year: string;
  title: string;
  client: string;
  location: string;
  summary: string;
  action: string;
}) {
  const frame = frameFor(orientation);
  const portrait = orientation === "portrait";

  return (
    <Link
      to={href}
      className={cn(
        "group grid overflow-hidden border border-line bg-white transition duration-200 hover:border-gold motion-reduce:transition-none",
        portrait ? "lg:grid-cols-[minmax(16rem,24rem)_1fr]" : "lg:grid-cols-2",
      )}
    >
      <CoverImage
        src={imageSrc}
        alt={imageAlt}
        objectPosition={frame.position}
        loading="eager"
        fetchPriority="high"
        className={cn("w-full", frame.aspect, portrait && "mx-auto max-w-md")}
      />
      <div className="flex flex-col p-6 sm:p-10 lg:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">
          {category} · {year}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">{title}</h2>
        <p className="mt-4 text-sm text-muted">
          {client} · {location}
        </p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/85">{summary}</p>
        <p className="mt-6 max-w-xl border-t border-line pt-4 text-sm leading-relaxed text-muted">{imageAlt}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          {action}
          <ArrowRight
            className="h-4 w-4 transition duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
