import "../main.css"
import NavBar from "../Component/Navbar.jsx"

function Home(){
  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section class="hero">
          <h2>Discover and rate movies</h2>
        </section>

      <section class="movies-row">
        <article class="card movie-card">
          <div class="poster" aria-hidden="true">Poster</div>
          <h3>Inception</h3>
          <p class="meta">2010</p>
          <p class="stars">★ ★ ★ ★ ☆</p>
        </article>

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
    </section>
  </main>


</div>

  );
}

export default Home;

