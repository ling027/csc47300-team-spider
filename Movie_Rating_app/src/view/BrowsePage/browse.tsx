import "../main.css";
import "./browse.css";
import { useState, useEffect } from 'react';
import NavBar from "../Component/Navbar";
import { Link } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { useFormatters, getStars } from "../../utils/formatHelpers";
import { tmdb, type Movie as TmdbMovie, type Genre } from '../../api/tmbd';
import Pagination from "../Component/Pagination/pagination";

interface MovieData {
  id: number;
  title: string;
  poster: string;
  rating: string;
  ratingValue: number;
  releaseDate: string;
  genreIds?: number[];
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
    genreIds: movie.genre_ids,
  };
}

function Browse() {
  const { t } = useLang();
  const { formatDate } = useFormatters();
  const [trendingMovies, setTrendingMovies] = useState<MovieData[]>([]);
  const [searchResults, setSearchResults] = useState<MovieData[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [totalSearchPages, setTotalSearchPages] = useState(1);
  const [genreMovies, setGenreMovies] = useState<MovieData[]>([]);
  const [totalGenrePages, setTotalGenrePages] = useState(1);
  const [isFilteringByGenre, setIsFilteringByGenre] = useState(false);

  const itemsPerPage = 20;

  // Fetch genres on initial load
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresResponse = await tmdb.getGenres();
        setGenres(genresResponse.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch trending movies on initial load
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
        setInitialLoad(false);
      }
    };
    if (initialLoad && !isSearching && !isFilteringByGenre) {
      fetchMovies();
    }
  }, [initialLoad, isSearching, isFilteringByGenre]);

  // Fetch search results when searching
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setIsSearching(false);
        return;
      }

      try {
        setLoading(true);
        const searchResponse = await tmdb.searchMovies(searchQuery.trim(), currentPage);
        const transformed = searchResponse.results.map(transformMovie);
        setSearchResults(transformed);
        setTotalSearchPages(searchResponse.total_pages);
      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isSearching && searchQuery.trim() && !isFilteringByGenre) {
      fetchSearchResults();
    }
  }, [searchQuery, currentPage, isSearching, isFilteringByGenre]);

  // Fetch movies by genre
  useEffect(() => {
    const fetchGenreMovies = async () => {
      if (selectedGenre === null) {
        setIsFilteringByGenre(false);
        setGenreMovies([]);
        return;
      }

      try {
        setLoading(true);
        const genreResponse = await tmdb.discoverMoviesByGenre(selectedGenre, currentPage, selectedRating || undefined);
        const transformed = genreResponse.results.map(transformMovie);
        setGenreMovies(transformed);
        setTotalGenrePages(genreResponse.total_pages);
        setIsFilteringByGenre(true);
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenre !== null) {
      fetchGenreMovies();
    }
  }, [selectedGenre, currentPage, selectedRating]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setIsFilteringByGenre(false);
      setSelectedGenre(null);
      setCurrentPage(1); // Reset to first page on new search
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setCurrentPage(1);
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value === "" ? null : parseInt(e.target.value);
    setSelectedGenre(genreId);
    setIsSearching(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ratingValue = e.target.value;
    // Rating ranges on TMDB 0-10 scale
    // "8+" = 8.0+, "7+" = 7.0+, "6+" = 6.0+, "5+" = 5.0+, "4+" = 4.0+
    const minRating = ratingValue === "" ? null : parseFloat(ratingValue);
    setSelectedRating(minRating);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Show full loading screen only on initial load
  if (initialLoad && loading) {
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

  // Determine which movies to display
  // Priority: genre filter > search > trending
  let totalPages: number;
  let currentMovies: MovieData[];
  
  if (isFilteringByGenre && selectedGenre !== null) {
    // Genre results with API-level rating filtering (already applied in API call)
    totalPages = totalGenrePages;
    currentMovies = genreMovies;
  } else if (isSearching) {
    // Search results - apply client-side rating filter since search API doesn't support vote_average
    let filteredResults = searchResults;
    if (selectedRating !== null) {
      filteredResults = searchResults.filter(movie => movie.ratingValue >= selectedRating);
    }
    totalPages = totalSearchPages; // Keep original page count for navigation
    currentMovies = filteredResults;
  } else {
    // Trending movies - apply client-side rating filter and pagination
    let filteredMovies = trendingMovies;
    if (selectedRating !== null) {
      filteredMovies = trendingMovies.filter(movie => movie.ratingValue >= selectedRating);
    }
    totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);
  }

  return (
    <div className="body">
      <header className="site-header">
        <NavBar />
      </header>
      <main className="container">
        <h2 style={{color:"white"}}>{t("browseHeader")}</h2>

        <form className="toolbar" role="search" onSubmit={handleSearch}>
          <label className="visually-hidden" htmlFor="q">
            Search
          </label>
          <input 
            id="q" 
            className="input" 
            type="search" 
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />

          <label className="visually-hidden" htmlFor="genre">
            Genre
          </label>
          <select 
            id="genre" 
            className="select" 
            value={selectedGenre === null ? "" : selectedGenre.toString()}
            onChange={handleGenreChange}
          >
            <option value="">{t("allGenres")}</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>

          <label className="visually-hidden" htmlFor="rating">
            Rating
          </label>
          <select 
            id="rating" 
            className="select" 
            value={selectedRating === null ? "" : selectedRating.toString()}
            onChange={handleRatingChange}
          >
            <option value="">{t("anyRating")}</option>
            <option value="8">8.0+ (Excellent)</option>
            <option value="7">7.0+ (Very Good)</option>
            <option value="6">6.0+ (Good)</option>
            <option value="5">5.0+ (Average)</option>
            <option value="4">4.0+ (Below Average)</option>
          </select>

          <button className="btn" type="submit">
            {t("search")}
          </button>
        </form>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>Loading...</div>
        ) : currentMovies.length === 0 && isSearching ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
            No movies found for "{searchQuery}"{selectedRating !== null ? ` with rating ${selectedRating.toFixed(1)}+` : ""}
          </div>
        ) : currentMovies.length === 0 && isFilteringByGenre ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
            No movies found for this genre{selectedRating !== null ? ` with rating ${selectedRating.toFixed(1)}+` : ""}
          </div>
        ) : currentMovies.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
            No movies found{selectedRating !== null ? ` with rating ${selectedRating.toFixed(1)}+` : ""}
          </div>
        ) : (
          <>
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
                    <p className="stars">{getStars(movie.ratingValue !== undefined ? movie.ratingValue : movie.rating)}</p>
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Browse;
