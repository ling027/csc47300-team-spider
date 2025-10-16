// src/view/BrowsePage/browse.jsx

import "./main.css";
import NavBar from "../Component/Navbar.jsx";
import { Link } from "react-router-dom"; // (can be removed if unused)
import { movies } from "../../MovieDetailPage/movies.js";

// i18n + helpers (from HEAD)
import { useLang } from "../../i18n/LanguageContext.jsx";
import { useFormatters } from "../../utils/formatHelpers.js";

// MovRow (incoming change)
import MovRow from "../Component/MovieRow.jsx";

function Browse() {
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();

  return (
    <div className="body">
      <header className="site-header">
        <NavBar />
      </header>

      <main className="container">
        <section className="browse-header">
          <h2>{t("browseHeader")}</h2>
        </section>

        {/* Toolbar / filters (non-functional, as before) */}
        <form className="toolbar" role="search" aria-label="Movie search (visual only)">
          <label className="visually-hidden" htmlFor="q">Search</label>
          <input id="q" className="input" type="search" placeholder={t("searchPlaceholder")} />

          <label className="visually-hidden" htmlFor="genre">Genre</label>
          <select id="genre" className="select">
            <option selected>{t("allGenres")}</option>
            <option>{t("actionGenre")}</option>
            <option>{t("adventure")}</option>
            <option>{t("drama")}</option>
            <option>{t("scifi")}</option>
            <option>{t("animation")}</option>
            <option>{t("comedy")}</option>
            <option>{t("thriller")}</option>
          </select>

          <label className="visually-hidden" htmlFor="rating">Rating</label>
          <select id="rating" className="select">
            <option selected>{t("anyRating")}</option>
            <option>5★</option>
            <option>4★+</option>
            <option>3★+</option>
            <option>2★+</option>
            <option>1★+</option>
          </select>

          <button className="btn" type="button" aria-disabled="true" title="Non-functional">
            {t("search")}
          </button>
        </form>

        {/* Use MovRow instead of the old inline .map(...) */}
        <section className="movies-row">
          <MovRow rowslogan="" link_addon="" movD={movies} />
        </section>
      </main>
    </div>
  );
}

export default Browse;
