// src/view/HomePage/home.jsx
import "./main.css";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetailCard.css"; // keep if you actually use this stylesheet
import NavBar from "../Component/Navbar.jsx";
import { Link } from "react-router-dom";
import { movies } from "../MovieDetailPage/movies.js";
import { upcomingMovies } from "../MovieDetailPage/movies.js";

import { useLang } from "../i18n/LanguageContext.jsx";
import MovRow from "../Component/MovieRow.jsx";

function Home() {
  const { t } = useLang();

  // pick a featured movie (Everything Everywhere All at Once in your dataset, id=2 in the screenshot)
  const EEAO = movies.find((m) => m.id === 2);

  return (
    <div className="body">
      <header className="site-header">
        <NavBar />
      </header>

      <main className="container">
        {/* Featured / Welcome section */}
        {EEAO && (
          <section className="Welcome-container">
            <Link to={`/movie/${EEAO.id}`}>{EEAO.title}</Link>
            <section className="promoted-container">
              <img src={EEAO.poster} className="PromotedPoster" alt={`${EEAO.title} poster`} />
              {EEAO.trailer && (
                <video src={EEAO.trailer} muted autoPlay loop className="PromotedTrailer" />
              )}
            </section>
          </section>
        )}

        {/* Rows using the shared component */}
        <MovRow rowslogan={t("discoverRate")} link_addon="" movD={movies} />
        <MovRow rowslogan={t("comingSoonSection")} link_addon="coming-soon/" movD={upcomingMovies} />
      </main>
    </div>
  );
}

export default Home;
