import { Link } from "react-router-dom";
import { company } from "../../data/site";
import { footerNav } from "../../data/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { mapsUrl } from "../../lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-paper/75">{t.footer.blurb}</p>
          <p className="mt-4 font-display text-lg text-brass">{t.footer.tagline}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">{t.footer.visit}</h2>
          <address className="mt-4 text-sm leading-relaxed text-paper/80 not-italic">
            {t.about.address}
          </address>
          <a
            href={mapsUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-brass underline underline-offset-4"
          >
            {t.contact.map}
          </a>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">{t.footer.talk}</h2>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li>
              <a href={`tel:${company.phoneTel}`} className="hover:text-brass">
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="break-all hover:text-brass">
                {company.email}
              </a>
            </li>
            <li>
              {t.footer.proprietor}: {company.proprietor}
            </li>
            <li>
              {t.footer.gstin}: {company.gstin}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-paper/80 hover:text-brass">
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 pb-24 pt-5 text-xs leading-relaxed text-paper/60 sm:px-8">
          <p>
            © {year} {company.displayName}. {t.footer.rights}
          </p>
          <p>{t.footer.sourceNote}</p>
          <p>{t.footer.whatsappNote}</p>
        </div>
      </div>
    </footer>
  );
}
