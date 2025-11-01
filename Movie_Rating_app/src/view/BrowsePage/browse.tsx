import "../main.css";
import "./browse.css";
import { useState, useEffect } from 'react';
import NavBar from "../Component/Navbar";
import { Link } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { useFormatters } from "../../utils/formatHelpers";
import { tmdb, type Movie as TmdbMovie } from '../../api/tmbd';
import Pagination from "../Component/Pagination/pagination";

interface MovieData {
  id: number;
  title: string;
  poster: string;
  rating: string;
  ratingValue: number;
  releaseDate: string;
  trailer?: string;
}

function transformMovie(movie: TmdbMovie): MovieData {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '',
    rating: movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A',
    ratingValue: movie.vote_average || 0,
    releaseDate: movie.release_date || '',
  };
}

function Browse() {
  const { t } = useLang();
  const { formatDate } = useFormatters();
  const [trendingMovies, setTrendingMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const trendingResponse = await tmdb.trendingMovies(1);
        const transformed = trendingResponse.results.map(transformMovie);
        setTrendingMovies(transformed);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="body">
        <header className="site-header">
          <NavBar />
        </header>
        <main className="container">
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        </main>
      </div>
    );
  }

  const totalPages = Math.ceil(trendingMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = trendingMovies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="body">
      <header className="site-header">
        <NavBar />
      </header>
      <main className="container">
        <h2 style={{color:"white"}}>{t("browseHeader")}</h2>

        <form className="toolbar" role="search" aria-label="Movie search (visual only)">
          <label className="visually-hidden" htmlFor="q">
            Search
          </label>
          <input id="q" className="input" type="search" placeholder={t("searchPlaceholder")} />

          <label className="visually-hidden" htmlFor="genre">
            Genre
          </label>
          <select id="genre" className="select" defaultValue="All Genres">
            <option>{t("allGenres")}</option>
            <option>{t("actionGenre")}</option>
            <option>{t("adventure")}</option>
            <option>{t("drama")}</option>
            <option>{t("scifi")}</option>
            <option>{t("animation")}</option>
            <option>{t("comedy")}</option>
            <option>{t("thriller")}</option>
          </select>

          <label className="visually-hidden" htmlFor="rating">
            Rating
          </label>
          <select id="rating" className="select" defaultValue="Any Rating">
            <option>{t("anyRating")}</option>
            <option>★ 5</option>
            <option>★ 4+</option>
            <option>★ 3+</option>
            <option>★ 2+</option>
          </select>

          <button className="btn" type="button" aria-disabled="true" title="Non-functional">
            {t("search")}
          </button>
        </form>

        <div className="browse-movies">
          {currentMovies.map((movie) => (
            <div key={movie.id} className="card">
              <Link to={`/movie/${movie.id}/${movie.title}`}>
                <img
                  style={{ width: "200px", height: "300px" }}
                  src={movie.poster}
                  alt={movie.title}
                />
                <p className="stars">{movie.rating}</p>
                <h3>{movie.title}</h3>
                <p className="meta">{formatDate(movie.releaseDate)}</p>
                <p className="stars">★ ★ ★ ★ ☆</p>
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
