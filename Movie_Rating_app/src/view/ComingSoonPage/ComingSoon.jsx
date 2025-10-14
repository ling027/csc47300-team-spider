import "./comingsoon.css";
import { upcomingMovies } from "../MovieDetailPage/movies.js";
import { Link } from "react-router-dom";
import NavBar from "../Component/Navbar.jsx"


function StarRow({ value = 5 }) {
  // simple static 5-star row (fill based on value if you like)
  return (
    <div className="stars" aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, value)}{"☆☆☆☆☆".slice(0, 5 - value)}
    </div>
  );
}

function ComingSoonCard({ m }) {
  return (
    <article className="cs-card">
      <div className="cs-poster-wrap">
        <img src={m.poster} alt={`${m.title} poster`} />
        <div className="cs-badge">Coming&nbsp;Soon</div>
      </div>

      <h3 className="cs-title">{m.title}</h3>
      <div className="cs-meta">
        <span>{m.genre}</span>
        <span>•</span>
        <span className="cs-date">{m.DOR}</span>
      </div>

      <p className="cs-synopsis">{m.synopsis}</p>

      <div key={m.id} className="cs-actions">
        {/* Optional: deep-link to a future details page id space */}
        <Link to={`/movie/coming-soon/${m.id}`} className="cs-btn cs-btn-ghost" >
          Details
        </Link>
        <button className="cs-btn">Add to Watchlist</button>
      </div>
    </article>
  );
}

export default function ComingSoon() {
  return (
    <>
    <header className="site-header">
        <NavBar />
    </header>
    <main className="cs-container">
      <header className="cs-header">
        <h1>Coming Soon</h1>
        <p className="cs-subtitle">Trailers, dates, and hype — all in one place.</p>
      </header>

      <section className="cs-grid">
        {upcomingMovies.map((m) => (
          <ComingSoonCard key={m.id} m={m} />
        ))}
      </section>
    </main>
    </>
  );
}