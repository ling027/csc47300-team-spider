import "./comingsoon.css";
import "../main.css";
import { upcomingMovies } from "../MovieDetailPage/movies.js";
import { Link } from "react-router-dom";
import NavBar from "../Component/Navbar"
import { useLang } from "../../i18n/LanguageContext.jsx"; 
import { useFormatters } from "../../utils/formatHelpers.js";


function StarRow({ value = 5 }) {
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();


  // simple static 5-star row (fill based on value if you like)
  return (
    <div className="stars" aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, value)}{"☆☆☆☆☆".slice(0, 5 - value)}
    </div>
  );
}

function ComingSoonCard({ m }) {
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();


  return (
    <article className="cs-card">
      <div className="cs-poster-wrap">
        <img src={m.poster} alt={`${m.title} poster`} />
        <div className="cs-badge">{t("comingSoon")}</div>
      </div>

      <h3 className="cs-title">{m.title}</h3>
      <div className="cs-meta">
        <span>{formatGenres(m.genres ?? m.genre)}</span>
        <span>•</span>
        <span className="cs-date">{m.releaseDate ? formatDate(m.releaseDate) : (m.DOR || "")}</span>
      </div>

      <p className="cs-synopsis">{getSynopsis(m.synopsis)}</p>

      <div key={m.id} className="cs-actions">
        {/* Optional: deep-link to a future details page id space */}
        <Link to={`/movie/coming-soon/${m.id}/${m.title}`} className="cs-btn cs-btn-ghost" >
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
    <div className="body">
        <header className="site-header">
        <NavBar />
    </header>
   
    <div className="cs-container">
  
   
      <header className="cs-header">
        <h1>{t("comingSoon")}</h1>
        <p className="cs-subtitle">{t("discoverRate")}</p>
      </header>

      <section className="cs-grid">
        {upcomingMovies.map((m) => (
          <ComingSoonCard key={m.id} m={m} />
        ))}
      </section>
    
    </div>
     </div>
  );
}