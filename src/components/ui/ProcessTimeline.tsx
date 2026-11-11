import { stepOrder } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";

export function ProcessTimeline({ titleAs = "h3" }: { titleAs?: "h2" | "h3" }) {
  const { t } = useLanguage();
  const Title = titleAs;

  return (
    <ol className="grid gap-8 lg:grid-cols-5 lg:gap-5">
      {stepOrder.map((id, index) => (
        <li key={id} className="relative pl-14 lg:pl-0 lg:pt-14">
          <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center bg-navy font-display text-sm text-gold">
            0{index + 1}
          </span>
          {index < stepOrder.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-10 -bottom-8 left-5 w-px bg-gold/50 lg:bottom-auto lg:left-10 lg:top-5 lg:h-px lg:w-[calc(100%-1.25rem)]"
            />
          ) : null}
          <Title className="text-base font-semibold leading-snug text-navy">{t.approach.steps[id].title}</Title>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.approach.steps[id].body}</p>
        </li>
      ))}
    </ol>
  );
}
