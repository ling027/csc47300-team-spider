import "../main.css"
import NavBar from "../Component/Navbar.jsx"
import {Link, useNavigate} from 'react-router-dom';

function Browse(){
  return(
<body>
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
      <Link to="/inception">
      <article class="card movie-card">
        <div class="poster" aria-hidden="true">Poster</div>
        <h3>Inception</h3>
        <p class="meta">2010</p>
        <p class="stars">★ ★ ★ ★ ☆</p>
      </article>
      </Link>

      <article class="card movie-card">
        <div class="poster" aria-hidden="true">Poster</div>
        <h3>Interstellar</h3>
        <p class="meta">2014</p>
        <p class="stars">★ ★ ★ ★ ★</p>
      </article>

      <article class="card movie-card">
        <div class="poster" aria-hidden="true">Poster</div>
        <h3>Arrival</h3>
        <p class="meta">2016</p>
        <p class="stars">★ ★ ★ ★ ☆</p>
      </article>

      <article class="card movie-card">
        <div class="poster" aria-hidden="true">Poster</div>
        <h3>Dune</h3>
        <p class="meta">2021</p>
        <p class="stars">★ ★ ★ ★ ☆</p>
      </article>

      <article class="card movie-card">
        <div class="poster" aria-hidden="true">Poster</div>
        <h3>Spider-Verse</h3>
        <p class="meta">2018</p>
        <p class="stars">★ ★ ★ ★ ★</p>
      </article>
    </section>
  </main>
</body>
  );
}

export default Browse;