import type { ReactNode } from "react";

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-gold bg-sand px-4 py-3 text-sm leading-relaxed text-ink">{children}</p>
  );
}
