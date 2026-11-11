import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { company } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { openWhatsApp } from "../../lib/whatsapp";

export function WhatsAppButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open ? (
        <div role="group" aria-label={t.a11y.whatsappNumbers} className="mb-2 border border-white/20 bg-white">
          {company.phones.map((phone) => (
            <button
              key={phone.whatsapp}
              type="button"
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-navy hover:bg-mist"
              onClick={() => {
                openWhatsApp(t.whatsappGreeting, phone.whatsapp);
                setOpen(false);
              }}
            >
              {phone.display}
            </button>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-label={t.whatsappFloat}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 bg-[#128C7E] px-3.5 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-[#0e7569] motion-reduce:transition-none"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        <span className="hidden lg:inline">{t.whatsappFloat}</span>
      </button>
    </div>
  );
}
