import "../main.css"
import "../Component/MovieDetailCard/MovieDetailCard.css"
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import {movies} from "../MovieDetailPage/movies.js";
import { upcomingMovies } from "../MovieDetailPage/movies.js";
import { useLang } from "../../i18n/LanguageContext.jsx"; 
import { useFormatters } from "../../utils/formatHelpers.js";
import MovRow from "../Component/MovieRow.jsx"

/*<section class="hero">
          <h2>{t("discoverRate")}</h2>
        </section>*/
 /*<section class="hero">
          <h2>{t("comingSoonSection")}</h2>
        </section>*/
function Home(){
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();
  const EEAAO = movies.find((m) => m.id === 2);

  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section className="welcome-container">
          <Link to={ `/movie/${EEAAO.id}`}>
          <section className="promoted-container">
            <img src={EEAAO.poster} className="PromotedPoster"/>
            <video src={EEAAO.trailer} muted autoPlay loop className="PromotedTrailer"></video>
          </section>
          </Link>
        </section>

        <section class="hero">
          <h2>{t("discoverRate")}</h2>
        </section>

      <section class="movies-row">
         {movies.map((movie) => (
            <div key={movie.id} className="card">
            <Link to={`/movie/${movie.id}`}>
               <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
               <h3 className="moviecard-title">{movie.title}</h3>
                <p className="meta" >{formatDate(movie.releaseDate)}</p>
              <p class="stars">★ ★ ★ ★ ☆</p>
            </Link>
        </div>
      ))}
      </section>

      <section class="hero">
        <h2>{t("comingSoonSection")}</h2>
      </section>

      <section class="movies-row">
         {upcomingMovies.map((movie) => (
            <div key={movie.id} className="card">
            <Link to={`/movie/coming-soon/${movie.id}`} >
               <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px", borderRadius:"16px"}}src={movie.poster}/></div>
               <h3 className="moviecard-title">{movie.title}</h3>
                <p class="meta">{movie.DOR}</p>
            </Link>
        </div>
      ))}
      </section>

  </main>


</div>

  );
}

export default Home;

