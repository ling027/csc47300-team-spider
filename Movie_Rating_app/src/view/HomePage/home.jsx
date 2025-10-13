import "../main.css"
import "../Component/MovieDetailCard/MovieDetailCard.css"
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import {movies} from "../MovieDetailPage/movies.js";

function Home(){
  const EEAAO = movies.find((m) => m.id === 2);

  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section className="welcome-container">
          <Link to={ `/movie/${EEAAO.id}`}>
          <section className="promoted-container">
            <img src={EEAAO.poster} className="PromotedPoster"/>
            <video src={EEAAO.trailer} muted autoPlay loop className="PromotedTrailer"></video>
          </section>
          </Link>
        </section>
        <section class="hero">
          <h2>Discover and rate movies</h2>
        </section>

      <section class="movies-row">
         {movies.map((movie) => (
            <div key={movie.id} className="card">
            <Link to={`/movie/${movie.id}`}>
               <div className="poster" aria-hidden="true"><img style={{width:"200px", height:"300px"}}src={movie.poster}/></div>
               <h3 style={{width:"200px"}}>{movie.title}</h3>
                <p class="meta">2010</p>
              <p class="stars">★ ★ ★ ★ ☆</p>
            </Link>
        </div>
      ))}
      </section>
  </main>


</div>

  );
}

export default Home;

