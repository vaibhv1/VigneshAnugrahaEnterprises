import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

export function ServiceCard({
  href,
  icon: Icon,
  title,
  body,
  index,
}: {
  href?: string;
  icon: LucideIcon;
  title: string;
  body: string;
  index?: string;
}) {
  const className =
    "group flex h-full flex-col border border-line bg-white p-6 transition duration-200 hover:border-gold motion-reduce:transition-none";
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center bg-mist text-navy transition duration-200 group-hover:bg-navy group-hover:text-gold">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {index ? <span className="font-display text-lg text-gold-ink">{index}</span> : null}
      </div>
      <h3 className="mt-6 font-display text-[1.65rem] leading-tight text-navy">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      {href ? (
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
