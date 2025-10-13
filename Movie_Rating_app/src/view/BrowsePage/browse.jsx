import "../main.css"
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import {movies} from "../MovieDetailPage/movies.js";

function Browse(){
  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section class="browse-header">
          <h2>Browse Movies</h2>
      </section>

 
      <form class="toolbar" role="search" aria-label="Movie search (visual only)">
        <label class="visually-hidden" for="q">Search</label>
        <input id="q" class="input" type="search" placeholder="Search by title or year…" />

        <label class="visually-hidden" for="genre">Genre</label>
        <select id="genre" class="select">
          <option selected>All Genres</option>
          <option>Action</option>
          <option>Adventure</option>
          <option>Drama</option>
          <option>Sci-Fi</option>
         <option>Animation</option>
        </select>

        <label class="visually-hidden" for="rating">Rating</label>
        <select id="rating" class="select">
          <option selected>Any Rating</option>
          <option>★ 5</option>
          <option>★ 4+</option>
          <option>★ 3+</option>
          <option>★ 2+</option>
        </select>

        <button class="btn" type="button" aria-disabled="true" title="Non-functional">Search</button>
      </form>

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

export default Browse;