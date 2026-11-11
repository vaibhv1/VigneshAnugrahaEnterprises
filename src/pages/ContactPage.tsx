import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { EnquiryForm } from "../components/enquiry/EnquiryForm";
import { Container } from "../components/ui/Container";
import { Note } from "../components/ui/Note";
import { PageBanner } from "../components/ui/PageBanner";
import { PageMeta } from "../components/ui/PageMeta";
import { mapsUrl, whatsappUrl } from "../lib/whatsapp";

export function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta title={t.meta.contactTitle} description={t.meta.contactDescription} />
      <PageBanner
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        lede={t.contact.lede}
        crumbs={[
          { label: t.nav.home, to: "/" },
          { label: t.nav.contact },
        ]}
      />
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h2 className="font-display text-3xl text-navy">{t.footer.visit}</h2>
            <address className="mt-4 text-base leading-relaxed not-italic">{t.about.address}</address>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {t.contact.map}
            </a>
            <ul className="mt-8 space-y-4">
              {company.phones.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className="inline-flex items-center gap-3 text-navy">
                    <Phone className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted">{t.contact.call}</span>
                      {phone.display}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="inline-flex items-center gap-3 text-navy">
                  <Mail className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted">{t.contact.email}</span>
                    {company.email}
                  </span>
                </a>
              </li>
              {company.phones.map((phone) => (
                <li key={phone.whatsapp}>
                  <a
                    href={whatsappUrl(t.whatsappGreeting, phone.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-navy"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted">{t.contact.whatsapp}</span>
                      {phone.display}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
              <div>
                <dt className="text-muted">{t.about.labels.proprietor}</dt>
                <dd className="text-navy">{company.proprietor}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.about.labels.gstin}</dt>
                <dd className="text-navy">{company.gstin}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.contact.hoursLabel}</dt>
                <dd className="mt-1">
                  <Note>{t.contact.hoursValue}</Note>
                </dd>
              </div>
            </dl>
          </div>
          <div className="border border-line bg-white p-5 sm:p-8">
            <h2 className="font-display text-3xl text-navy">{t.contact.formTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.contact.formLede}</p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
