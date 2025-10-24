import { createContext, useContext, useEffect, useMemo, useState } from "react";


const translations = {
  en: {
    //NavBar
    home: "Home",
    browse: "Browse",
    comingSoon: "Coming Soon",
    watchlist: "Watch List",
    login: "Login",
    contact: "Contact Us",

    // home
    discoverRate: "Discover and rate movies",
    comingSoonSection: "Coming soon!",

    // browse
    browseHeader: "Browse Movies",
    searchPlaceholder: "Search by title or year…",
    allGenres: "All Genres",
    genreLabel: "Genre:",
    anyRating: "Any Rating",
    search: "Search",
    actionGenre: "Action",
    adventure: "Adventure",
    drama: "Drama",
    scifi: "Sci-Fi",
    animation: "Animation",
    thriller: "Thriller",
    comedy: "Comedy",
    fantasy: "Fantasy",

    // watchlist
    yourWatchlist: "Your Watchlist",
    title: "Title",
    year: "Year",
    rating: "Rating",
    action: "Action",
    remove: "Remove",

    // login
    username: "Username:",
    yourUsername: "Your Username",
    password: "Password:",
    yourPassword: "Your Password",
    noAccount: "Don't have an account? Sign Up",

    // signup
    yourFirstAndLastName: "Your First and Last Name",
    signUp: "Sign Up",
    fullname: "Your Name",
    email: "Your Email",
    reenterPassword: "Re-enter Password:",
    reenterYourPassword: "Re-enter your password",
    signUpButton: "Sign Up",

    // contact
    contactUs: "Contact us",
    feedback: "Give us your feedback",
    name: "Name",
    message: "Message",
    giveUsYourThoughts: "Give us your thoughts!",
    submit: "Submit",
    submitting: "Submitting...",

    //comingsoon
    detailsLabel: "Details",
    addToWatchlist: "Add to Watchlist",

    //movie.jsx
    cast: "Cast:",
    studio: "Studio:",
    director: "Director:",
    screenwriter: "Screenwriter:",


  },
  el: {
    home: "Αρχική",
    browse: "Περιήγηση",
    comingSoon: "Σύντομα",
    watchlist: "Λίστα Παρακολούθησης",
    login: "Σύνδεση",
    contact: "Επικοινωνία",

    discoverRate: "Ανακαλύψτε και βαθμολογήστε ταινίες",
    comingSoonSection: "Έρχονται σύντομα!",

    browseHeader: "Περιηγηθείτε στις Ταινίες",
    searchPlaceholder: "Αναζήτηση κατά τίτλο ή έτος…",
    allGenres: "Όλα τα είδη",
    genreLabel: "Είδος:",
    anyRating: "Κάθε Βαθμολογία",
    search: "Αναζήτηση",
    actionGenre: "Δράση",
    adventure: "Περιπέτεια",
    drama: "Δράμα",
    scifi: "Επιστημονική Φαντασία",
    animation: "Κινουμένων Σχεδίων",
    thriller: "Θρίλερ",
    comedy: "Κωμωδία",
    fantasy: "Φαντασίας",

    yourWatchlist: "Η λίστα παρακολούθησής σας",
    title: "Τίτλος",
    year: "Έτος",
    rating: "Βαθμολογία",
    action: "Ενέργεια",
    remove: "Αφαίρεση",

    username: "Όνομα χρήστη:",
    yourUsername: "Το Όνομα Χρήστη σας",
    password: "Κωδικός:",
    yourPassword: "Ο Κωδικός σας",
    noAccount: "Δεν έχετε λογαριασμό; Εγγραφείτε",

    yourFirstAndLastName: "Το Όνομα και το Επώνυμό σας",
    signUp: "Εγγραφή",
    fullname: "Το Όνομά σας",
    email: "Το Email σας",
    reenterPassword: "Επαναλάβετε τον Κωδικό:",
    reenterYourPassword: "Επαναλάβετε τον κωδικό σας",
    signUpButton: "Εγγραφή",

    contactUs: "Επικοινωνία",
    feedback: "Δώστε μας τα σχόλιά σας",
    name: "Όνομα",
    message: "Μήνυμα",
    giveUsYourThoughts: "Πείτε μας τη γνώμη σας!",
    submit: "Υποβολή",
    submitting: "Υποβάλλεται...",

    detailsLabel: "Λεπτομέρειες",
    addToWatchlist: "Προσθήκη στη λίστα παρακολούθησης",

    cast: "Ηθοποιοί:",
    studio: "Στούντιο:",
    director: "Σκηνοθέτης:",
    screenwriter: "Σεναριογράφος:",

  },
 es: {
     home: "Inicio",
     browse: "Explorar",
     comingSoon: "Próximamente",
     watchlist: "Lista de seguimiento",
     login: "Iniciar sesión",
     contact: "Contáctanos",

     discoverRate: "Descubre y califica películas",
    comingSoonSection: "¡Próximamente!",

    browseHeader: "Explorar películas",
    searchPlaceholder: "Buscar por título o año…",
    allGenres: "Todos los géneros",
    genreLabel: "Género:",
    anyRating: "Cualquier puntuación",
    search: "Buscar",
    actionGenre: "Acción",
    adventure: "Aventura",
    drama: "Drama",
    scifi: "Ciencia ficción",
    animation: "Animación",
    thriller: "Suspenso / Thriller",
    comedy: "Comedia",
    fantasy: "Fantasía",

    yourWatchlist: "Tu lista de seguimiento",
    title: "Título",
    year: "Año",
    rating: "Puntuación",
    action: "Acción",
    remove: "Eliminar",

    username: "Nombre de usuario:",
    yourUsername: "Tu nombre de usuario",
    password: "Contraseña:",
    yourPassword: "Tu contraseña",
    noAccount: "¿No tienes una cuenta? Regístrate",

    yourFirstAndLastName: "Tu nombre y apellido",
    signUp: "Regístrate",
    fullname: "Tu nombre",
    email: "Tu correo electrónico",
    reenterPassword: "Reingresa la contraseña:",
    reenterYourPassword: "Vuelve a ingresar tu contraseña",
    signUpButton: "Regístrate",

    contactUs: "Contáctanos",
    feedback: "Danos tu opinión",
    name: "Nombre",
    message: "Mensaje",
    giveUsYourThoughts: "¡Dinos lo que piensas!",
    submit: "Enviar",
    submitting: "Enviando...",

    detailsLabel: "Detalles",
    addToWatchlist: "Agregar a la lista de seguimiento",

    cast: "Reparto:",
    studio: "Estudio:",
    director: "Director:",
    screenwriter: "Guionista:",
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
