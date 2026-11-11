import { useState } from "react";
import { Building2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../lib/cn";

export function CoverImage({
  src,
  alt,
  className,
  objectPosition = "center 35%",
  loading = "lazy",
  fetchPriority,
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy px-6 text-center text-gold">
          <Building2 className="h-7 w-7" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">{t.a11y.photoUnavailable}</p>
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
