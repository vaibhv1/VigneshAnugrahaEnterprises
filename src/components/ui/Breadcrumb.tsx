import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { company } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";

export type Crumb = {
  label: string;
  to?: string;
};

export function Breadcrumb({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const quiet = tone === "dark" ? "text-white/70" : "text-muted";
  const crumbKey = items.map((item) => `${item.label}|${item.to ?? ""}`).join(">");

  useEffect(() => {
    const scriptId = "breadcrumb-jsonld";
    const existing = document.getElementById(scriptId);
    const script = existing ?? document.createElement("script");
    script.id = scriptId;
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `${company.url}${item.to ?? pathname}`,
      })),
    });
    if (!existing) document.head.appendChild(script);
    return () => script.remove();
  }, [crumbKey, items, pathname]);
  const current = tone === "dark" ? "text-white" : "text-navy";
  const link = tone === "dark" ? "text-white/80 hover:text-gold" : "text-navy/80 hover:text-gold-ink";

  return (
    <nav aria-label={t.a11y.breadcrumb}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className={`h-3.5 w-3.5 ${quiet}`} aria-hidden="true" /> : null}
              {item.to && !last ? (
                <Link to={item.to} className={link}>
                  {item.label}
                </Link>
              ) : (
                <span className={current} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
