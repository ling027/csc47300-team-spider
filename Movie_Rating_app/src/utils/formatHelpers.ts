import { useLang } from "../i18n/LanguageContext.jsx";

// Convert TMDB rating (0-10 scale) to stars (0-5 scale)
export function getStars(ratingValue: number | string): string {
  let numericRating = 0;
  
  // Handle different input types
  if (typeof ratingValue === 'number') {
    numericRating = ratingValue;
  } else if (typeof ratingValue === 'string') {
    // Try to extract number from strings like "8.5/10" or "8.5"
    const match = ratingValue.match(/(\d+\.?\d*)/);
    if (match) {
      numericRating = parseFloat(match[1]);
      // If the string contains "/10", assume it's already on 0-10 scale
      // Otherwise, assume it might be on a different scale
      if (!ratingValue.includes('/10')) {
        // If it's just a number, assume it could be 0-5 scale, convert to 0-10
        if (numericRating <= 5) {
          numericRating = numericRating * 2;
        }
      }
    }
  }
  
  if (!numericRating || numericRating === 0) return '☆ ☆ ☆ ☆ ☆';
  
  // Ensure rating is on 0-10 scale, then convert to 0-5 scale
  if (numericRating > 10) {
    numericRating = (numericRating / 2); // If somehow > 10, normalize
  }
  
  const starRating = (numericRating / 2);
  
  // Round to nearest whole star for cleaner display
  const filledStars = Math.round(starRating);
  
  // Build star string (5 stars total)
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars += '★ ';
    } else {
      stars += '☆ ';
    }
  }
  
  return stars.trim();
}

export function useFormatters() {
  const { lang, t } = useLang();

  const formatDate = (iso: string): string => {
    try {
        const [y, m, d] = iso.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat(lang, { dateStyle: "long" })
        .format(dt);
    } catch {
      return "";
    }
  };

  const formatGenres = (keysOrText: string[] | string): string => {
    if (typeof keysOrText === "string") return keysOrText;
    return (keysOrText || []).map((k) => t(k)).join(", ");
  };

  const getSynopsis = (syn: string | { [key: string]: string } | undefined): string => {
    if (!syn) return "";
    if (typeof syn === "string") return syn;
    return syn[lang] || syn.en || "";
  };

  return { formatDate, formatGenres, getSynopsis };
}

