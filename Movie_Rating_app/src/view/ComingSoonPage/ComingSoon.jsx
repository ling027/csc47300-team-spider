// src/view/ComingSoonPage/ComingSoon.jsx

import "./comingsoon.css";
import { upcomingMovies } from "../../MovieDetailPage/movies.js";
import { Link } from "react-router-dom";
import NavBar from "../Component/Navbar.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { useFormatters } from "../../utils/formatHelpers.js";

function StarRow({ value = 5 }) {
  // simple static 5-star row (fill based on value if you like)
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters(); // (kept from HEAD so hooks remain available if needed)

  return (
    <div className="m-stars" aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, value)}
      {"☆☆☆☆☆".slice(0, 5 - value)}
    </div>
  );
}

function ComingSoonCard({ m }) {
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();

  return (
    <article className="cs-card">
      <div className="cs-poster-wrap">
        <img className="cs-poster" alt={`${m.title} poster`} src={m.poster} />
        <div className="cs-badge">{t("comingSoon")}</div>
      </div>

      <h3 className="cs-title">{m.title}</h3>

      <div className="cs-meta">
        <span className="cs-genres">
          {formatGenres(m.genres ?? m.genre)}
        </span>
        <span className="cs-date">
          {m.releaseDate ? formatDate(m.releaseDate) : (m.DOR || "")}
        </span>
      </div>

      <p className="cs-synopsis">{getSynopsis(m.synopsis)}</p>

      <div className="cs-actions">
        {/* Optional: deep-link to a future details page id space */}
        <Link to={`/movie/coming-soon/${m.id}`} className="cs-btn cs-btn-ghost">
          {t("detailsLabel")}
        </Link>
        <button className="cs-btn">{t("addToWatchlist")}</button>
      </div>
    </article>
  );
}

export default function ComingSoon() {
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();

  return (
    <div>
      <header className="site-header">
        <NavBar />
      </header>

      <main className="cs-container">
        <header className="cs-header">
          <h1>{t("comingSoon")}</h1>
          <p className="cs-subtitle">{t("discoverRate")}</p>
        </header>

        <section className="cs-grid">
          {upcomingMovies.map((m) => (
            <ComingSoonCard key={m.id} m={m} />
          ))}
        </section>
      </main>
    </div>
  );
}
