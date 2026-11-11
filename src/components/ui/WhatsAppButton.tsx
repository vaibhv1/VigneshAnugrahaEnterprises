import { MessageCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { openWhatsApp } from "../../lib/whatsapp";

export function WhatsAppButton() {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => openWhatsApp(t.whatsappGreeting)}
      aria-label={t.whatsappFloat}
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 bg-[#128C7E] px-3.5 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-[#0e7569] motion-reduce:transition-none"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span className="hidden lg:inline">{t.whatsappFloat}</span>
    </button>
  );
}
