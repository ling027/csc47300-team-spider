import { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    home: "Home",
    browse: "Browse",
    comingSoon: "Coming Soon",
    watchlist: "Watch List",
    login: "Login",
    contact: "Contact Us",
  },
  el: {
    home: "Αρχική",
    browse: "Περιήγηση",
    comingSoon: "Σύντομα",
    watchlist: "Λίστα Παρακολούθησης",
    login: "Σύνδεση",
    contact: "Επικοινωνία",
  },
 es: {
     home: "Inicio",
     browse: "Explorar",
     comingSoon: "Próximamente",
     watchlist: "Lista de seguimiento",
     login: "Iniciar sesión",
     contact: "Contáctanos",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en;
    return (key) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
