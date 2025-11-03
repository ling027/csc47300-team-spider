import InceptionTrailer from "../../assets/InceptionTrailer.mp4"
import EEAAOTrailer from "../../assets/EEAAO.mp4"

export interface Synopsis {
  en: string;
  el?: string;
  es?: string;
}

export interface Movie {
  id: number;
  title: string;
  poster: string;
  trailer: string;
  genre: string[] | string;
  releaseDate?: string;
  DOR?: string;
  synopsis: Synopsis | string;
  rating: string;
  length: string;
  casts?: string;
  studio?: string;
  director?: string;
  screenwriter?: string;
}

export const movies: Movie[] = [
    {
        id:1,
        title:"Inception", 
        poster:"https://c8.alamy.com/comp/2JH2PW0/movie-poster-inception-2010-2JH2PW0.jpg", 
        trailer: InceptionTrailer, 
        genre:["actionGenre", "scifi"],
        releaseDate:"2010-07-16", 
        synopsis:{
            en: "Acclaimed filmmaker Christopher Nolan directs an international cast in an original sci-fi actioner that travels around the globe and into the intimate and infinite world of dreams. Dom Cobb (Leonardo DiCaprio) is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible—inception.",
            el: "Ο καταξιωμένος σκηνοθέτης Κρίστοφερ Νόλαν σκηνοθετεί ένα διεθνές καστ σε μια πρωτότυπη ταινία επιστημονικής φαντασίας και δράσης, που ταξιδεύει σε ολόκληρο τον κόσμο και μέσα στον οικείο και άπειρο κόσμο των ονείρων. Ο Ντομ Κομπ (Λεονάρντο Ντι Κάπριο) είναι ένας έμπειρος κλέφτης — ο καλύτερος στο επικίνδυνο έργο της εξαγωγής, κλέβοντας πολύτιμα μυστικά από τα βάθη του υποσυνείδητου κατά τη διάρκεια του ονείρου, όταν το μυαλό είναι πιο ευάλωτο. Η σπάνια ικανότητά του έχει κάνει τον Κομπ περιζήτητο παίκτη σε αυτόν τον επικίνδυνο νέο κόσμο της εταιρικής κατασκοπείας, αλλά τον έχει επίσης μετατρέψει σε διεθνή φυγά και του έχει στερήσει ό,τι αγαπούσε περισσότερο. Τώρα του προσφέρεται μια ευκαιρία για λύτρωση — μια τελευταία αποστολή που θα μπορούσε να του δώσει πίσω τη ζωή του, μόνο αν καταφέρει το αδύνατο: την «Έναρξη» (Inception).",
            es: "El aclamado director Christopher Nolan dirige a un elenco internacional en una película original de ciencia ficción y acción que viaja por todo el mundo y se adentra en el íntimo e infinito mundo de los sueños. Dom Cobb (Leonardo DiCaprio) es un ladrón experto, el mejor en el peligroso arte de la extracción, robando valiosos secretos desde lo más profundo del subconsciente durante el estado de sueño, cuando la mente es más vulnerable. Su rara habilidad lo ha convertido en una pieza codiciada en este traicionero nuevo mundo del espionaje corporativo, pero también lo ha convertido en un fugitivo internacional y le ha costado todo lo que amaba. Ahora, Cobb tiene la oportunidad de redimirse. Un último trabajo podría devolverle su vida, pero solo si logra lo imposible: la "Origen" (Inception)."
          },
        rating:"R",
        length:`145 min`,
        casts:"Leonardo DiCaprio, Ken Watanabe, Joseph Gordon-Levitt, Marion Cotillard, Ellen Page, Tom Hardy, Cillian Murphy, Tom Berenger, Michael Caine",
        studio:"Warner Bros. Pictures",
        director:"Christopher Nolan",
        screenwriter:"Christopher Nolan",
    },

     {
        id:2,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:["scifi", "fantasy", "comedy", "actionGenre", "adventure"],
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:3,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },
    {
        id:4,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },
    {
        id:5,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },
       {
        id:6,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:7,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:8,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:9,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:10,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },

    {
        id:11,
        title:"Everything Everywhere all at once", 
        poster:"https://image.tmdb.org/t/p/original/sWN1bP08KXuzlBwsO0T0HJEeIy9.jpg", 
        trailer:EEAAOTrailer, 
        genre:`Science fiction, Fantasy, Comedy, Action & adventure`, 
        DOR:"2022", 
        synopsis:`...`, 
        rating:"R",
        casts:`...`,
        length:`139 min`,
        studio:``,
        director:``,
        screenwriter:``,
    },
];
export const upcomingMovies: Movie[] = [
    {
      id: 1,
      title: "Spider-Man: Brand New Day",
      poster: "https://posterspy.com/wp-content/uploads/2025/04/SPIDER-MAN-BRAND-NEW-DAY.jpg",
      genre: ["scifi", "adventure"],
      releaseDate: "2026-07-31",
      rating: "PG-13",
      length: "165 min",
      trailer: EEAAOTrailer,
      synopsis:{
        en: "Spider-Man: Brand New Day is an upcoming American superhero film based on the Marvel Comics character Spider-Man, co-produced by Columbia Pictures and Marvel Studios, and distributed by Sony Pictures Releasing.",
        el: "Το Spider-Man: Brand New Day είναι μια επερχόμενη αμερικανική ταινία υπερήρωα, βασισμένη στον χαρακτήρα των κόμικς της Marvel, Spider-Man. Συμπαράγεται από τις Columbia Pictures και Marvel Studios και διανέμεται από τη Sony Pictures Releasing.",
        es: "Spider-Man: Brand New Day es una próxima película estadounidense de superhéroes basada en el personaje de los cómics de Marvel, Spider-Man. Es coproducida por Columbia Pictures y Marvel Studios, y distribuida por Sony Pictures Releasing."
      }
    },
    {
      id: 2,
      title: "Animal Friends",
      poster: "https://a.ltrbxd.com/resized/film-poster/1/0/0/5/0/0/5/1005005-animal-friends-0-230-0-345-crop.jpg?v=ccd62e9c52",
      genre: ["comedy", "actionGenre"],
      releaseDate: "2026-05-01",
      rating: "PG",
      length: "130 min",
      trailer: EEAAOTrailer,
      synopsis:{
            en: "Animal Friends is an upcoming American live-action animated road comedy film directed by Peter Atencio and written by Kevin Burrows and Matt Mider. The film follows a group of animals on a wild adventure.",
            el: "Το Animal Friends είναι μια επερχόμενη αμερικανική ταινία κωμωδίας δρόμου με συνδυασμό ζωντανής δράσης και κινουμένων σχεδίων, σε σκηνοθεσία του Πίτερ Ατένσιο και σενάριο των Κέβιν Μπάροουζ και Ματ Μάιντερ. Η ταινία ακολουθεί μια ομάδα ζώων σε μια τρελή περιπέτεια.",
            es: "Animal Friends es una próxima película estadounidense de comedia de carretera con acción real y animación, dirigida por Peter Atencio y escrita por Kevin Burrows y Matt Mider. La película sigue a un grupo de animales en una aventura salvaje."
      }
    },
    {
      id: 3,
      title: "Greenland 2: Migration",
      poster: "https://m.media-amazon.com/images/M/MV5BOWE3ZmQxNzMtNGE2NC00ZmFjLWIwNmYtMThmNTUzMmM2NWEwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      genre: ["thriller", "actionGenre"],
      releaseDate: "2026-01-09",
      rating: "PG-13",
      length: "170 min",
      trailer: EEAAOTrailer,
      synopsis:{
        en: "In the aftermath of a comet strike that decimated most of the planet, the Garrity family must leave the safety of their Greenland bunker to traverse a shattered world in search of a new home.",
        el: "Μετά την πρόσκρουση ενός κομήτη που κατέστρεψε το μεγαλύτερο μέρος του πλανήτη, η οικογένεια Γκάρριτι πρέπει να εγκαταλείψει την ασφάλεια του καταφυγίου της στη Γροιλανδία και να διασχίσει έναν κατεστραμμένο κόσμο αναζητώντας ένα νέο σπίτι.",
        es: "Tras el impacto de un cometa que destruyó gran parte del planeta, la familia Garrity debe abandonar la seguridad de su refugio en Groenlandia y cruzar un mundo devastado en busca de un nuevo hogar."
      }
    },
  ];

