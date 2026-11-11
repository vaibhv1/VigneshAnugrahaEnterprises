import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { frameFor, type Photo } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../lib/cn";

export type GalleryPhoto = {
  src: string;
  alt: string;
  orientation?: Photo["orientation"];
};

export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setIndex(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const active = index !== null ? photos[index] : null;

  return (
    <>
      <ul className={cn("grid gap-5", photos.length > 1 && "sm:grid-cols-2")}>
        {photos.map((photo, photoIndex) => {
          const frame = frameFor(photo.orientation ?? "landscape");
          return (
            <li
              key={photo.src}
              className={cn(
                photo.orientation === "panorama" && "sm:col-span-2",
                photos.length === 1 && photo.orientation === "portrait" && "max-w-md",
              )}
            >
              <figure>
                <button
                  type="button"
                  onClick={() => setIndex(photoIndex)}
                  className={cn("relative block w-full overflow-hidden bg-navy text-left", frame.aspect)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: frame.position }}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="sr-only">{t.a11y.enlarge}</span>
                </button>
                <figcaption className="mt-2 text-sm leading-relaxed text-muted">{photo.alt}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="text-paper"
        aria-label={active?.alt}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {active ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-sm text-paper/80">
                {(index ?? 0) + 1} / {photos.length}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex items-center gap-2 text-sm"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {t.a11y.closeDialog}
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:px-4">
              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/30"
                onClick={() =>
                  setIndex((current) =>
                    current === null ? current : (current - 1 + photos.length) % photos.length,
                  )
                }
                aria-label={t.a11y.previousPhoto}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <img
                src={active.src}
                alt={active.alt}
                className="max-h-[72vh] max-w-full object-contain"
              />
              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/30"
                onClick={() =>
                  setIndex((current) => (current === null ? current : (current + 1) % photos.length))
                }
                aria-label={t.a11y.nextPhoto}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mx-auto max-w-3xl px-5 py-4 text-center text-sm leading-relaxed text-paper/85">
              {active.alt}
            </p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
