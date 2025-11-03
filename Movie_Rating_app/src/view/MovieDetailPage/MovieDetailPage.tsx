import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { movies, upcomingMovies } from "./movies.js";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail";
import "./MovieDetailPage.css";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { tmdb } from "../../api/tmbd";
import type { MovieDetails, Credits, Video } from "../../api/tmbd";
import {useAuth} from "../../context/AuthContext";
import { FaUserLarge } from 'react-icons/fa6';

function formatDate(lang: string, iso: string): string {
  if (!iso) return "";
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(dt);
  } catch {
    return "";
  }
}

function normalizeForRender(movie: any, lang: string, t: (key: string) => string) {
  // genre can be a string or an array of keys
  const genreText = Array.isArray(movie.genre)
    ? movie.genre.map((k: string) => t(k)).join(", ")
    : movie.genres
    ? movie.genres.map((k: any) => t(k)).join(", ")
    : movie.genre || "";

  // date may be DOR (string) or releaseDate (ISO)
  const dateText = movie.releaseDate
    ? formatDate(lang, movie.releaseDate)
    : movie.DOR || "";

  // synopsis may be string or {en, el, es}
  const synopsisText =
    movie.synopsis && typeof movie.synopsis === "object"
      ? movie.synopsis[lang] || movie.synopsis.en || ""
      : movie.synopsis || "";

  return { genreText, dateText, synopsisText };
}

// Get trailer URL from TMDB video key
function getTrailerUrl(trailer: Video): string | null {
  if (!trailer || trailer.site !== "YouTube") return null;
  
  // Return YouTube embed URL for autoplay, mute, and loop
  return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}`;
}

// Transform TMDB MovieDetails to match static movie format
function transformTMDBMovie(movieDetails: MovieDetails & { credits: Credits }, trailer: string | null, lang: string): any {
  // Get genres as a string (for display)
  const genres = movieDetails.genres?.map(g => g.name).join(", ") || "";
  
  // Get cast (top 10)
  const cast = movieDetails.credits?.cast
    .slice(0, 10)
    .map(c => c.name)
    .join(", ") || "";
  
  // Get director from crew
  const director = movieDetails.credits?.crew
    .find(c => c.job === "Director")?.name || "";
  
  // Get screenwriter from crew (try multiple job titles)
  const screenwriter = movieDetails.credits?.crew
    .find(c => c.job === "Screenplay" || c.job === "Writer" || c.job === "Screenwriter")?.name || "";
  
  // Get production company (prefer the first one, but could concatenate multiple)
  const studio = movieDetails.production_companies?.[0]?.name || "";
  
  // Format runtime
  const length = movieDetails.runtime ? `${movieDetails.runtime} min` : "";
  
  // Format rating (using vote_average)
  const rating = movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)}/10` : "N/A";
  
  return {
    id: movieDetails.id,
    title: movieDetails.title,
    poster: movieDetails.poster_path 
      ? `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` 
      : "",
    trailer: trailer,
    genre: genres, // Pass as string to avoid translation lookup
    releaseDate: movieDetails.release_date,
    synopsis: movieDetails.overview || "",
    rating: rating,
    casts: cast,
    length: length,
    studio: studio,
    director: director,
    screenwriter: screenwriter,
  };
}

interface CommentInterface{
  id: number;
  text: string;
}

function MDP({ source }: { source: any[] }) {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { lang, t } = useLang();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const existingUser = JSON.parse(localStorage.getItem("user") || "null");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
 
  useEffect(() => {
  const saved: CommentInterface[] = JSON.parse(
    localStorage.getItem(`comments_${numId}`) || "[]"
  );
  setComments(saved);
}, [numId]);

const handleCommentSubmit = () => {
  if (!isLoggedIn) {
    alert("Please Sign in to submit comments!");
    return;
  }
  if (!commentInput.trim()) return;

  const newComment: CommentInterface = {
    id: Date.now(),
    text: commentInput.trim(),
  };

  const updatedComments = [...comments, newComment];
  localStorage.setItem(`comments_${numId}`, JSON.stringify(updatedComments));
  setComments(updatedComments);
  setCommentInput("");
};


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const staticMovie = source.find((m) => m.id === numId);

        if (staticMovie) {
          setMovie(staticMovie);
          setLoading(false);
          return;
        }

        if (numId > 10) {
          const [movieDetails, videosResponse] = await Promise.all([
            tmdb.getMovieDetails(numId),
            tmdb.getMovieVideos(numId).catch(() => null),
          ]);

          let trailerUrl: string | null = null;
          if (videosResponse) {
            const trailers = videosResponse.results.filter(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );
            const officialTrailer = trailers.find((v) =>
              v.name.toLowerCase().includes("official")
            );
            const trailer = officialTrailer || trailers[0];
            if (trailer) {
              trailerUrl = getTrailerUrl(trailer);
            }
          }

          const transformed = transformTMDBMovie(movieDetails, trailerUrl, lang);
          setMovie(transformed);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError(err instanceof Error ? err.message : "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id, source, lang]);


  if (loading) {
    return (
      <main className="container">
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container">
        <p>{error || "Not found."}</p>
      </main>
    );
  }

  const { genreText, dateText, synopsisText } = normalizeForRender(movie, lang, t);

  return (
    <div className="Movie-datail-container">
      <div style={{ width: "100%" }}>
        <MovieDetailCard
          title={movie.title}
          poster={movie.poster}
          trailer={movie.trailer}
          genre={genreText}
          DOR={dateText}
          synopsis={synopsisText}
          rating={movie.rating}
          casts={movie.casts}
          length={movie.length}
          studio={movie.studio}
          director={movie.director}
          screenwriter={movie.screenwriter}
        />

        <section className="comment-container">
          <section className="comment-section">
            <input
              name="Message"
              placeholder={t("giveUsYourThoughts")}
              className="comment"
              required
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            />
            <button className="comment-btn" type="button" onClick={handleCommentSubmit}>
              {t("submit")}
            </button>
          </section>

          <section style={{width:"100%",height:"100%"}}>
            {comments.length === 0 ? (
              <p style={{color: "black", marginTop: "100px", textAlign:"center"}}>Be the first one to comment on this movie!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment-items">
                  <article className="comment-item">
                    <h2><FaUserLarge /> {existingUser?.username || "Guest"}</h2>
                    <h3 className="user-handle">{existingUser?.email || ""}</h3>
                    <p className="comment-content">{c.text}</p>
                  </article>
                </div>
              ))
            )}
          </section>
        </section>
      </div>
    </div>
  );
}


export const MovieDetailPage = () => <MDP source={movies} />;
export const UCMoiveDetailPage = () => <MDP source={upcomingMovies} />;

