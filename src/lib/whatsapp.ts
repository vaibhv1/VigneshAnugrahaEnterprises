import { company } from "../data/site";

export function whatsappUrl(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const url = whatsappUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapsQuery)}`;
}
