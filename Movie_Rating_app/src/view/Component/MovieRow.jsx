// src/view/Component/MovieRow.jsx
import "./main.css";
import { Link } from "react-router-dom";

function MovRow({ rowslogan = "", link_addon = "", movD = [] }) {
  const Row = (
    <section className="movies-row">
      {movD.map((movie) => (
        <div key={movie.id} className="card">
          <Link to={`/movie/${link_addon}${movie.id}/${movie.title}`}>
            <div className="poster" aria-hidden="true">
              <img style={{ width: "200px", height: "300px" }} src={movie.poster} alt={`${movie.title} poster`} />
            </div>
            <p className="stars">{movie.rating}</p>
            <h3 className="moviecard-title">{movie.title}</h3>
          </Link>
        </div>
      ))}
    </section>
  );

  // If no slogan, just render the row
  if (!rowslogan) return Row;

  // Otherwise include a header/hero section
  return (
    <section className="hero">
      <h2>{rowslogan}</h2>
      <section>{Row}</section>
    </section>
  );
}

export default MovRow;
