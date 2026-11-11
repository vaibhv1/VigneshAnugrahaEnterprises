import { company } from "../data/site";

export function whatsappUrl(message: string, number: string = company.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, number: string = company.whatsapp) {
  const url = whatsappUrl(message, number);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapsQuery)}`;
}
