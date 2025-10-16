// src/view/Component/MovieDetailCard/MovieDetail.jsx
import "./main.css";
import "./moviedetailcard.css";           // keep your card styles (adjust path if needed)
import NavBar from "../Navbar.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

const MovieDetail = ({
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

  return (
    <>
      <header className="site-header">
        <NavBar />
      </header>

      <div className="Movie-Info">
        <div className="MovieDetail-Container">
          <h1 className="MovieDetail-title">{title}</h1>
          <p className="meta">
            <strong>{t("DOR")}</strong> {DOR ?? ""} &nbsp;|&nbsp;
            <strong>{t("rating")}</strong> {rating ?? ""} &nbsp;|&nbsp;
            <strong>{t("length")}</strong> {length ?? ""}
          </p>

          <section className="visual-container">
            <img className="MoviePoster" src={poster} alt={`${title} poster`} />
            {trailer && (
              <video className="trailer" muted loop controls autoPlay>
                <source src={trailer} />
              </video>
            )}
          </section>

          <div className="detail-grid">
            <div className="Genre-Container">
              <p className="genre">
                <strong>{t("genreLabel")}:</strong> {genre}
              </p>
              <p className="description">
                <strong>{t("synopsis")}:</strong> {synopsis}
              </p>
              <p className="crew">
                <strong>{t("studio")}:</strong> {studio}
              </p>
              <p className="crew">
                <strong>{t("director")}:</strong> {director}
              </p>
              <p className="crew">
                <strong>{t("screenwriter")}:</strong> {screenwriter}
              </p>
            </div>

            <div className="Cast-Container">
              <p className="team-info">
                <strong>{t("casts")}:</strong> {casts}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
