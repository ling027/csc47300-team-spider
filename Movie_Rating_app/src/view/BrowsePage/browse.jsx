import "../main.css"
import "./browse.css"
import {useState} from 'react'
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import {movies} from "../MovieDetailPage/movies.js";
import { useLang } from "../../i18n/LanguageContext.jsx"; 
import { useFormatters } from "../../utils/formatHelpers.js";
import Pagination from "../Component/Pagination/pagination.jsx";


function Browse(){
  const { t } = useLang();
  const { formatDate, formatGenres, getSynopsis } = useFormatters();

  const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(movies.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMovie = movies.slice(startIndex, startIndex + itemsPerPage);

  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section class="browse-header">
          <h2>{t("browseHeader")}</h2>
      </section>

 
      <form class="toolbar" role="search" aria-label="Movie search (visual only)">
        <label class="visually-hidden" for="q">Search</label>
        <input id="q" class="input" type="search" placeholder={t("searchPlaceholder")} />

        <label class="visually-hidden" for="genre">Genre</label>
        <select id="genre" class="select">
          <option selected>{t("allGenres")}</option>
          <option>{t("actionGenre")}</option>
          <option>{t("adventure")}</option>
          <option>{t("drama")}</option>
          <option>{t("scifi")}</option>
         <option>{t("animation")}</option>
         <option>{t("comedy")}</option>
         <option>{t("thriller")}</option>

        </select>

        <label class="visually-hidden" for="rating">Rating</label>
        <select id="rating" class="select">
          <option selected>{t("anyRating")}</option>
          <option>★ 5</option>
          <option>★ 4+</option>
          <option>★ 3+</option>
          <option>★ 2+</option>
        </select>

        <button class="btn" type="button" aria-disabled="true" title="Non-functional">{t("search")}</button>
      </form>

      
    <div className="browse-movies">
      {currentMovie.map((movie) => (
                    <div key={movie.id} className="card">
                    <Link to={`/movie/${movie.id}/${movie.title}`}>
                    <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
                        <p  class="stars">{movie.rating}</p>
                        <h3 className="moviecard-title">{movie.title}</h3>
                        <p className="meta" >{formatDate(movie.releaseDate)}</p>
                        <p class="stars">★ ★ ★ ★ ☆</p>
                    </Link>
                          </div>
      ))}
    </div>

        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
       

  </main>
</div>
  );
}

export default Browse;