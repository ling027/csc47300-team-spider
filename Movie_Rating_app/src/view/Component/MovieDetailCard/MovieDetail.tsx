import "./MovieDetailCard.css";
import "../../main.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../Navbar";
import { tmdb } from "../../../api/tmbd";
import { useLang } from "../../../i18n/LanguageContext";
import { useAuth } from "../../../context/AuthContext";
import { CiStar } from "react-icons/ci";

interface MovieDetailProps {
  title: string;
  poster: string;
  trailer?: string;
  genre: string;
  DOR: string;
  synopsis: string;
  rating: string;
  casts: string;
  length: string;
  studio: string;
  director: string;
  screenwriter: string;
}

interface BookmarkMovie {
  id: number;
  title: string;
  poster: string;
  rating: string;
  releaseDate?: string;
}

const MovieDetail: React.FC<MovieDetailProps> = ({
  title,
  poster,
  trailer,
  genre,
  DOR,
  synopsis,
  rating,
  casts,
  length,
  studio,
  director,
  screenwriter,
}) => {
  const { t } = useLang();
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check bookmark state on load
  useEffect(() => {
    const bookmarks: BookmarkMovie[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsFavorite(bookmarks.some((m) => m.id === numId));
  }, [numId]);

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      alert("Please sign in to add favorite movies!");
      return;
    }

    const bookmarks: BookmarkMovie[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const existing = bookmarks.find((m) => m.id === numId);

    if (existing) {
      // Remove bookmark
      const updated = bookmarks.filter((m) => m.id !== numId);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Add bookmark
      const newBookmark: BookmarkMovie = {
        id: numId,
        title,
        poster,
        rating,
        releaseDate: DOR,
      };
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks, newBookmark]));
      setIsFavorite(true);
    }
  };

  return (
    <>
      <header className="site-header">
        <NavBar />
      </header>

      <div className="Movie-Infor">
        <div className="MovieDetail-Container">
          <section style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1 className="MovieTitle">{title}</h1>
            <button className="favorite-button" onClick={toggleFavorite}>
              {isFavorite ? <CiStar style={{color:"#ffdd59"}}/> : <CiStar />}
            </button>
          </section>

          <p>{DOR} • {rating} • {length}</p>

          <section className="visual-container">
            <img className="MoviePoster" src={poster} alt={`${title} poster`} />
            {trailer && (
              trailer.startsWith("https://www.youtube.com/embed/") ? (
                <iframe
                  className="trailer"
                  src={trailer}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                  title={`${title} trailer`}
                ></iframe>
              ) : (
                <video className="trailer" muted loop controls autoPlay>
                  <source src={trailer} />
                </video>
              )
            )}
          </section>

          <p className="Genre-Container">
            <strong>{t("genreLabel")}</strong> {genre}
          </p>

          <p className="description">{synopsis}</p>

          <div className="Team-infor">
            <p><strong>{t("cast")}</strong> {casts}</p>
            <p><strong>{t("studio")}</strong> {studio}</p>
            <p><strong>{t("director")}</strong> {director}</p>
            <p><strong>{t("screenwriter")}</strong> {screenwriter}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
