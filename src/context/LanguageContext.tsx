import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { en, type Dictionary } from "../i18n/en";

type LanguageContextValue = {
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({ t: en }), []);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
