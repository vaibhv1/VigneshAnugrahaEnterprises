import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { company } from "../../data/site";

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function PageMeta({
  title,
  description,
  noindex = false,
}: {
  title: string;
  description: string;
  noindex?: boolean;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${company.url}${pathname === "/" ? "/" : pathname}`;
    const image = `${company.url}/media/project-01.jpg`;
    document.title = title;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, follow" : "index, follow");
    setLink("canonical", url);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", image, "property");
    setMeta("og:locale", "en_IN", "property");
    setMeta("og:site_name", company.displayName, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, noindex, pathname]);

  return null;
}
