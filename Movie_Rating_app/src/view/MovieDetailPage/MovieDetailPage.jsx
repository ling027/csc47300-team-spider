import { useParams } from "react-router-dom";
import { movies, upcomingMovies } from "./movies.js";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail.jsx";
import "./MovieDetailPage.css";
import { useLang } from "../../i18n/LanguageContext.jsx";

function formatDate(lang, iso) {
  if (!iso) return "";
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(dt);
  } catch {
    return "";
  }
}

function normalizeForRender(movie, lang, t) {
  // genre can be a string or an array of keys
  const genreText = Array.isArray(movie.genre)
    ? movie.genre.map((k) => t(k)).join(", ")
    : movie.genres
    ? movie.genres.map((k) => t(k)).join(", ")
    : movie.genre || "";

  // date may be DOR (string) or releaseDate (ISO)
  const dateText = movie.releaseDate
    ? formatDate(lang, movie.releaseDate)
    : movie.DOR || "";

  // synopsis may be string or {en, el, es}
  const synopsisText =
    movie.synopsis && typeof movie.synopsis === "object"
      ? movie.synopsis[lang] || movie.synopsis.en || ""
      : movie.synopsis || "";

  return { genreText, dateText, synopsisText };
}

function MDP({ source }) {
  const { id } = useParams();
  const numId = Number(id);
  const { lang, t } = useLang();

  const movie = source.find((m) => m.id === numId);

  if (!movie) {
    return (
      <main className="container">
        <p>Not found.</p>
      </main>
    );
  }

  const { genreText, dateText, synopsisText } = normalizeForRender(movie, lang, t);

  return (
    <div className="Movie-datail-container">
      <div>
        <MovieDetailCard
          title={movie.title}
          poster={movie.poster}
          trailer={movie.trailer}
          genre={genreText}
          DOR={dateText}
          synopsis={synopsisText}
          rating={movie.rating}
          casts={movie.casts}
          length={movie.length}
          studio={movie.studio}          
          director={movie.director}      
          screenwriter={movie.screenwriter} 
        />

        <section className="comment-container">
          <section className="comment-section">
            <input
              name="Message"
              placeholder={t("giveUsYourThoughts")}
              className="comment"
              required
            />
            <button className="comment-btn" type="submit">
            {t("submit")}
            </button>
          </section>
          <section className="comments"></section>
        </section>
      </div>
    </div>
  );
}

export const MovieDetailPage = () => <MDP source={movies} />;
export const UCMoiveDetailPage = () => <MDP source={upcomingMovies} />;
