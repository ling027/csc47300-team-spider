import "../main.css"
import {Link} from 'react-router-dom';
import { useFormatters } from "../../utils/formatHelpers.js";

function MovRow({rowslogan,link_addon, movD}){
  const { formatDate, formatGenres, getSynopsis } = useFormatters();
    if(rowslogan === "") return(
        <>
            <section class="movies-row">
                {movD.map((movie) => (
                    <div key={movie.id} className="card">
                    <Link to={`/movie/${link_addon}${movie.id}/${movie.title}`}>
                    <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
                        <p  class="stars">{movie.rating}</p>
                        <h3 className="moviecard-title">{movie.title}</h3>
                        <p className="meta" >{formatDate(movie.releaseDate)}</p>
                        <p class="stars">★ ★ ★ ★ ☆</p>
                    </Link>
                    </div>
      ))}
      </section>
    </>
    );
    return(
    <>
    <section class="hero">
          <h2>{rowslogan}</h2>
        </section>
     <section class="movies-row">
         {movD.map((movie) => (
            <div key={movie.id} className="card">
            <Link to={`/movie/${link_addon}${movie.id}/${movie.title}`}>
               <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
                <p  class="stars">{movie.rating}</p>
               <h3 className="moviecard-title">{movie.title}</h3>
               <p className="meta" >{formatDate(movie.releaseDate)}</p>
               <p class="stars">★ ★ ★ ★ ☆</p>
            </Link>
        </div>
      ))}
      </section>
    </>
  );

};

export default MovRow;