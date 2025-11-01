import { useState, useEffect } from 'react';
import "../main.css"
import "../Component/MovieDetailCard/MovieDetailCard.css"
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx"; 
import MovRow from "../Component/MovieRow.jsx"
import { tmdb } from '../../api/tmbd';
import type { Movie } from '../../api/tmbd';
import { movies } from "../MovieDetailPage/movies.js";
// Transform TMDB Movie to match the format expected by MovieRow
interface MovieData {
  id: number;
  title: string;
  poster: string;
  rating: string;
  ratingValue: number; // Store numeric rating for star calculation
  releaseDate: string;
  trailer?: string;
}

function transformMovie(movie: Movie): MovieData {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : '',
    rating: movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A',
    ratingValue: movie.vote_average || 0, // Store numeric rating for star calculation
    releaseDate: movie.release_date || '',
  };
}

// Check if a movie is unreleased (release date is in the future)
function isUnreleased(releaseDate: string): boolean {
  if (!releaseDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  const release = new Date(releaseDate);
  return release > today;
}

function Home(){
  const { t } = useLang();
  const [trendingMovies, setTrendingMovies] = useState<MovieData[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const EEAAO = movies.find((m) => m.id === 2);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [
          trendingResponse, 
          upcomingPage1, 
          upcomingPage2, 
          upcomingPage3
        ] = await Promise.all([
          tmdb.trendingMovies(1),
          tmdb.getUpcomingMovies(1),
          tmdb.getUpcomingMovies(2), 
          tmdb.getUpcomingMovies(3)  
        ]);
       

        // Process trending movies
        const transformedTrending = trendingResponse.results.map(transformMovie);
        setTrendingMovies(transformedTrending);
        
        // Combine all upcoming movie results into one big array
        const allUpcomingResults = [
          ...upcomingPage1.results,
          ...upcomingPage2.results,
          ...upcomingPage3.results
        ];

        // Process upcoming movies (with the combined list)

        const transformedUpcoming = allUpcomingResults
          .map(transformMovie)
          .filter(movie => isUnreleased(movie.releaseDate));
          
        setUpcomingMovies(transformedUpcoming);


      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);


  return(
    <div className="body">
      <header className="site-header">
        <NavBar/>
      </header>

      <main className="container">
        <section className="welcome-container">
          <Link to={ `/movie/${EEAAO?.id}/${EEAAO?.title}`}>
            <section className="promoted-container">
              <img src={EEAAO?.poster} className="PromotedPoster"/>
              <video src={EEAAO?.trailer} muted autoPlay loop className="PromotedTrailer"></video>
            </section>
          </Link>
        </section>
        
        <MovRow rowslogan={t("discoverRate")} link_addon="" movD={trendingMovies}/>

        <MovRow rowslogan={t("comingSoonSection")} link_addon="coming-soon/" movD={upcomingMovies}/>

      </main>
    </div>
  );
}

export default Home;

