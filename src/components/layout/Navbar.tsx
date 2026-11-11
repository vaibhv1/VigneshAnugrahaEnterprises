import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { company } from "../../data/site";
import { primaryNav } from "../../data/navigation";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";

function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const options: { id: Lang; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "kn", label: "ಕನ್ನಡ" },
  ];

  return (
    <div role="group" aria-label={t.a11y.language} className="flex border border-line">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={lang === option.id}
          onClick={() => setLang(option.id)}
          className={cn(
            "px-2.5 py-1.5 text-xs font-semibold transition duration-200",
            lang === option.id ? "bg-navy text-white" : "bg-white text-navy hover:bg-mist",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden bg-navy text-white lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 text-xs tracking-wide sm:px-8">
          <p>{t.home.eyebrow}</p>
          <div className="flex items-center gap-4">
            {company.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`} className="transition hover:text-gold">
                {phone.display}
              </a>
            ))}
          </div>
        </div>
      </div>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:gap-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label={t.a11y.primaryNav}>
          {primaryNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "text-sm text-ink/75 transition hover:text-navy",
                  isActive && "font-semibold text-navy underline decoration-gold decoration-2 underline-offset-8",
                )
              }
            >
              {t.nav[link.key]}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <a
            href={`tel:${company.phoneTel}`}
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-navy lg:hidden"
            aria-label={company.phoneDisplay}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
          </a>
          <span className="hidden sm:inline-flex">
            <Button to="/contact" variant="gold">
              {t.nav.enquire}
            </Button>
          </span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-navy lg:hidden"
            aria-controls={open ? "mobile-nav" : undefined}
            aria-expanded={open}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </header>
      {open ? (
        <nav id="mobile-nav" className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden" aria-label={t.a11y.mobileNav}>
          <ul className="flex flex-col">
            {primaryNav.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn("block border-b border-line py-3 text-lg text-navy", isActive && "font-semibold")
                  }
                >
                  {t.nav[link.key]}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2">
            {company.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className="text-base text-navy">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="gold" className="mt-4">
            {t.nav.enquire}
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
