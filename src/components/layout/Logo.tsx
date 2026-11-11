import { Link } from "react-router-dom";
import { company } from "../../data/site";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const name = tone === "light" ? "text-paper" : "text-navy";
  const sub = tone === "light" ? "text-brass" : "text-muted";
  const mark = tone === "light" ? "bg-gold text-navy" : "bg-navy text-gold";

  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={company.displayName}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center font-display text-lg tracking-wide ${mark}`} aria-hidden="true">
        VA
      </span>
      <span className="hidden min-w-0 leading-tight sm:block">
        <span className={`block truncate text-[0.72rem] font-semibold tracking-[0.14em] ${name}`}>
          VIGNESH ANUGRAHA
        </span>
        <span className={`block text-[0.68rem] tracking-[0.2em] ${sub}`}>ENTERPRISES</span>
      </span>
    </Link>
  );
}
