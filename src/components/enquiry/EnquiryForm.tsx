import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { company, serviceOrder, type ServiceId } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { en } from "../../i18n/en";
import { track } from "../../lib/analytics";
import { recordEnquiry } from "../../lib/enquirySheet";
import { openWhatsApp } from "../../lib/whatsapp";

type EnquiryType = "business" | "individual" | "other";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  enquiryType: EnquiryType | "";
  interest: string;
  message: string;
  website: string;
};

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus:border-navy";

function isMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local);
}

function isService(value: string | null): value is ServiceId {
  return serviceOrder.includes(value as ServiceId);
}

export function EnquiryForm() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const started = useRef(false);
  const audience = params.get("audience");
  const service = params.get("service");
  const defaultType: EnquiryType | "" =
    audience === "individual" || audience === "business" ? audience : "";
  const sheetConfigured = Boolean(import.meta.env.VITE_ENQUIRY_SHEET_URL && import.meta.env.VITE_ENQUIRY_SHEET_SECRET);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      location: "",
      enquiryType: defaultType,
      interest: isService(service) ? service : "general",
      message: "",
      website: "",
    },
  });

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("form_start");
  };

  const onSubmit = (number: string) => async (values: FormValues) => {
    if (values.website.trim()) return;
    const enquiryType = values.enquiryType || "other";
    const typeLabel = en.form.types[enquiryType];
    const interest =
      values.interest === "general"
        ? en.form.general
        : en.services.items[values.interest as ServiceId].title;
    const lines = [
      en.form.whatsappIntro,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() ? `Email: ${values.email.trim()}` : null,
      values.company.trim() ? `Company: ${values.company.trim()}` : null,
      `Enquiry type: ${typeLabel}`,
      `Interest: ${interest}`,
      values.location.trim() ? `Project location: ${values.location.trim()}` : null,
      "",
      values.message.trim(),
    ].filter((line): line is string => line !== null);

    setNotice(null);
    const formspree = import.meta.env.VITE_FORMSPREE_ID;
    if (formspree) {
      try {
        const response = await fetch(`https://formspree.io/f/${formspree}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name.trim(),
            phone: values.phone.trim(),
            email: values.email.trim(),
            company: values.company.trim(),
            enquiryType: typeLabel,
            interest,
            location: values.location.trim(),
            message: values.message.trim(),
          }),
        });
        if (!response.ok) setNotice(t.form.emailCopyFailed);
      } catch {
        setNotice(t.form.emailCopyFailed);
      }
    }

    const destination = company.phones.find((phone) => phone.whatsapp === number);
    await recordEnquiry({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      interest,
      language: "English",
      message: values.message.trim(),
      whatsappNumber: destination?.display ?? "",
    });
    track("form_submit", { enquiry_type: enquiryType, interest: values.interest });
    track("whatsapp_click", { location: "enquiry_form" });
    const url = openWhatsApp(lines.join("\n"), number);
    setSentUrl(url);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit(company.phones[0].whatsapp))}
      onFocus={markStarted}
      noValidate
      className="space-y-5"
    >
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy">
          {t.form.name}
        </label>
        <input
          id="name"
          autoComplete="name"
          className={fieldClass}
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name", { required: t.form.errors.name, minLength: { value: 2, message: t.form.errors.name } })}
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-sm text-red-800" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-navy">
          {t.form.phone}
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          className={fieldClass}
          aria-required="true"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone", {
            required: t.form.errors.phone,
            validate: (value) => isMobile(value) || t.form.errors.phone,
          })}
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1 text-sm text-red-800" role="alert">
            {errors.phone.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy">
          {t.form.email} <span className="font-normal text-muted">({t.form.emailOptional})</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", {
            validate: (value) => value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t.form.errors.email,
          })}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-sm text-red-800" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-navy">
          {t.form.company} <span className="font-normal text-muted">({t.form.emailOptional})</span>
        </label>
        <input id="company" autoComplete="organization" className={fieldClass} {...register("company")} />
      </div>
      <div>
        <label htmlFor="enquiryType" className="text-sm font-medium text-navy">
          {t.form.enquiryType}
        </label>
        <select
          id="enquiryType"
          className={fieldClass}
          aria-required="true"
          aria-invalid={errors.enquiryType ? true : undefined}
          {...register("enquiryType", { required: t.form.errors.enquiryType })}
        >
          <option value="">{t.form.errors.enquiryType}</option>
          <option value="business">{t.form.types.business}</option>
          <option value="individual">{t.form.types.individual}</option>
          <option value="other">{t.form.types.other}</option>
        </select>
        {errors.enquiryType ? (
          <p className="mt-1 text-sm text-red-800" role="alert">
            {errors.enquiryType.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="interest" className="text-sm font-medium text-navy">
          {t.form.interest} <span className="font-normal text-muted">({t.form.emailOptional})</span>
        </label>
        <select id="interest" className={fieldClass} {...register("interest")}>
          <option value="general">{t.form.general}</option>
          {serviceOrder.map((id) => (
            <option key={id} value={id}>
              {t.services.items[id].title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium text-navy">
          {t.form.location} <span className="font-normal text-muted">({t.form.emailOptional})</span>
        </label>
        <input id="location" className={fieldClass} {...register("location")} />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy">
          {t.form.message}
        </label>
        <textarea
          id="message"
          rows={5}
          className={fieldClass}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-hint message-error" : "message-hint"}
          {...register("message", {
            required: t.form.errors.message,
            minLength: { value: 10, message: t.form.errors.message },
          })}
        />
        <p id="message-hint" className="mt-2 text-sm text-muted">
          {t.form.messageHint}
        </p>
        {errors.message ? (
          <p id="message-error" className="mt-1 text-sm text-red-800" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {company.phones.map((phone) => (
          <button
            key={phone.whatsapp}
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit(phone.whatsapp))}
            className="inline-flex bg-navy px-5 py-3 text-sm font-medium text-paper hover:bg-navy-deep disabled:opacity-60"
          >
            {isSubmitting ? t.form.sending : `${t.contact.whatsapp} ${phone.display}`}
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted">{sheetConfigured ? t.form.sheetNote : t.contact.formLede}</p>
      {notice ? (
        <p className="text-sm text-red-800" role="alert">
          {notice}
        </p>
      ) : null}
      {sentUrl ? (
        <div className="border border-line bg-sand px-4 py-3 text-sm leading-relaxed" role="status">
          <p>{t.form.success}</p>
          {sentUrl.startsWith("http") ? (
            <a
              href={sentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-medium text-navy underline"
              onClick={() => track("whatsapp_click", { location: "enquiry_retry" })}
            >
              {t.form.retry}
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
