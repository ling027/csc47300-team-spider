// src/view/MovieDetailPage/MovieDetailPage.jsx
import "./main.css";
import { useParams } from "react-router-dom";

import { movies, upcomingMovies } from "./movies.js";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";

/** Format an ISO date in the user's language (UTC for consistency). */
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

/** Normalize fields that differ across sources / shapes. */
function normalizeForRender(movie, lang, t) {
  // genre can be string or array, sometimes under 'genres'
  let genres = [];
  if (Array.isArray(movie.genre)) genres = movie.genre;
  else if (Array.isArray(movie.genres)) genres = movie.genres;
  else if (movie.genre) genres = [movie.genre];

  const genreText = genres.map((k) => t(k)).join(", ");

  // prefer formatted releaseDate, else fallback to DOR (already localized label added in card)
  const dateText = movie.releaseDate ? formatDate(lang, movie.releaseDate) : (movie.DOR || "");

  // synopsis may be a string or an object keyed by lang
  const synopsisText =
    movie.synopsis && typeof movie.synopsis === "object"
      ? movie.synopsis[lang] || movie.synopsis.en || ""
      : movie.synopsis || "";

  return { genreText, dateText, synopsisText };
}

/** Generic detail page that renders a movie from a given source by id. */
function MDP({ source = [] }) {
  const { id } = useParams();
  const numID = Number(id);
  const { t, lang } = useLang();

  const movie = source.find((m) => m.id === numID);

  if (!movie) {
    return (
      <main className="container">
        <p>Not found.</p>
      </main>
    );
  }

  const { genreText, dateText, synopsisText } = normalizeForRender(movie, lang, t);

  return (
    <div className="Movie-detail-container">
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

      {/* (Optional) lightweight comment box scaffold, keep if you use it */}
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
        <section className="comments" />
      </section>
    </div>
  );
}

// Route-level pages
export const MovieDetailPage = () => <MDP source={movies} />;
export const UMovieDetailPage = () => <MDP source={upcomingMovies} />;
