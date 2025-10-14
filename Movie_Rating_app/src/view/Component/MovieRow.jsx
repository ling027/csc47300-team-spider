import "../main.css"
import {Link} from 'react-router-dom';

function MovRow({rowslogan,link_addon, movD}){
    if(rowslogan === "") return(
        <>
            <section class="movies-row">
                {movD.map((movie) => (
                    <div key={movie.id} className="card">
                    <Link to={`/movie/${link_addon}${movie.id}/${movie.title}`}>
                    <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
                        <p  class="stars">{movie.rating}</p>
                        <h3 className="moviecard-title">{movie.title}</h3>
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
            </Link>
        </div>
      ))}
      </section>
    </>
  );

};

export default MovRow;