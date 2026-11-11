import { useEffect } from "react";
import { company } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function PageMeta({ title, description }: { title: string; description: string }) {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:locale", lang === "kn" ? "kn_IN" : "en_IN", "property");
    setMeta("og:site_name", company.displayName, "property");
  }, [title, description, lang]);

  return null;
}
