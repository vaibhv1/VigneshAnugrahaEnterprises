import { projectCategories, type ProjectCategory } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../lib/cn";

export function ProjectFilters({
  value,
  onChange,
}: {
  value: ProjectCategory | "all";
  onChange: (value: ProjectCategory | "all") => void;
}) {
  const { t } = useLanguage();
  const options = ["all", ...projectCategories] as const;

  return (
    <div role="group" aria-label={t.projects.filtersLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        const label = option === "all" ? t.projects.filterAll : t.projects.categories[option];
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "border px-4 py-2 text-sm font-semibold transition duration-200 motion-reduce:transition-none",
              selected ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-gold",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
