import { company } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { track } from "../../lib/analytics";
import { whatsappUrl } from "../../lib/whatsapp";
import { Button } from "./Button";
import { CtaSection } from "./CtaSection";

export function EnquiryBand({ message }: { message?: string }) {
  const { t } = useLanguage();
  const text = message ?? t.whatsappGreeting;

  return (
    <CtaSection
      eyebrow={t.home.closeEyebrow}
      title={t.home.closeTitle}
      body={t.home.closeBody}
      action={
        <>
          <Button to="/contact" variant="gold" onClick={() => track("enquiry_cta_click", { location: "band" })}>
            {t.home.closeCta}
          </Button>
          <Button
            href={whatsappUrl(text, company.phones[0].whatsapp)}
            variant="ghost"
            onClick={() => track("whatsapp_click", { location: "band" })}
          >
            {t.contact.whatsapp}
          </Button>
          <Button href={`tel:${company.phones[0].tel}`} variant="ghost" onClick={() => track("phone_click", { location: "band" })}>
            {company.phones[0].display}
          </Button>
        </>
      }
    />
  );
}
