import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export function ServiceCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href?: string;
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  const className =
    "group flex h-full flex-col border border-line bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-gold motion-reduce:transform-none motion-reduce:transition-none";
  const content = (
    <>
      <span className="grid h-11 w-11 place-items-center bg-mist text-navy transition duration-200 group-hover:bg-navy group-hover:text-gold">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-2xl text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
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
