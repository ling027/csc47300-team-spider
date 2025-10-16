import { useLang } from "../i18n/LanguageContext.jsx";

export function useFormatters() {
  const { lang, t } = useLang();

  const formatDate = (iso) => {
    try {
        const [y, m, d] = iso.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat(lang, { dateStyle: "long" })
        .format(dt);
    } catch {
      return "";
    }
  };

  const formatGenres = (keysOrText) => {
    if (typeof keysOrText === "string") return keysOrText;
    return (keysOrText || []).map((k) => t(k)).join(", ");
  };

  const getSynopsis = (syn) => {
    if (!syn) return "";
    if (typeof syn === "string") return syn;
    return syn[lang] || syn.en || "";
  };

  return { formatDate, formatGenres, getSynopsis };
}
