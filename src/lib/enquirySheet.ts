export type EnquiryRecord = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  language: "English" | "Kannada";
  message: string;
  whatsappNumber: string;
};

const SHEET_TIMEOUT_MS = 4000;

/** Adds the contact-form enquiry to the private sheet. Never blocks WhatsApp. */
export async function recordEnquiry(record: EnquiryRecord): Promise<void> {
  const url = import.meta.env.VITE_ENQUIRY_SHEET_URL;
  const secret = import.meta.env.VITE_ENQUIRY_SHEET_SECRET;
  if (!url || !secret) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEET_TIMEOUT_MS);
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, ...record }),
      signal: controller.signal,
    });
  } catch {
    // The visitor still continues to WhatsApp when the sheet is unreachable.
  } finally {
    clearTimeout(timer);
  }
}
