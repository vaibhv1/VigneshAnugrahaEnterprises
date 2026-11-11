import { useState } from "react";
import { useForm } from "react-hook-form";
import { company, serviceOrder, type ServiceId } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { en } from "../../i18n/en";
import { openWhatsApp } from "../../lib/whatsapp";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus:border-navy";

function isMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local);
}

export function EnquiryForm() {
  const { t, lang } = useLanguage();
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", phone: "", email: "", interest: "general", message: "" },
  });

  const onSubmit = (values: FormValues) => {
    const interest =
      values.interest === "general"
        ? en.form.general
        : en.services.items[values.interest as ServiceId].title;
    const lines = [
      en.form.whatsappIntro,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() ? `Email: ${values.email.trim()}` : null,
      `Interest: ${interest}`,
      lang === "kn" ? "Form language: Kannada" : null,
      "",
      values.message.trim(),
    ].filter((line): line is string => line !== null);
    const url = openWhatsApp(lines.join("\n"));
    setSentUrl(url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
          {t.form.email}{" "}
          <span className="font-normal text-muted">({t.form.emailOptional})</span>
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
        <label htmlFor="interest" className="text-sm font-medium text-navy">
          {t.form.interest}
        </label>
        <select id="interest" className={fieldClass} aria-required="true" {...register("interest", { required: true })}>
          <option value="general">{t.form.general}</option>
          {serviceOrder.map((id) => (
            <option key={id} value={id}>
              {t.services.items[id].title}
            </option>
          ))}
        </select>
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
        <p id="message-hint" className="mt-2 text-sm text-muted">{t.form.messageHint}</p>
        {errors.message ? (
          <p id="message-error" className="mt-1 text-sm text-red-800" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex bg-navy px-5 py-3 text-sm font-medium text-paper hover:bg-navy-deep disabled:opacity-60"
      >
        {isSubmitting ? t.form.sending : t.form.submit}
      </button>
      <p className="text-sm leading-relaxed text-muted">
        {t.contact.formLede} {company.phoneDisplay}.
      </p>
      {sentUrl ? (
        <div className="border border-line bg-sand px-4 py-3 text-sm leading-relaxed" role="status">
          <p>{t.form.success}</p>
          <a href={sentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block font-medium text-navy underline">
            {t.form.retry}
          </a>
        </div>
      ) : null}
    </form>
  );
}
