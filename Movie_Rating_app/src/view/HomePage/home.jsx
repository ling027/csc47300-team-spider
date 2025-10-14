import "../main.css"
import "../Component/MovieDetailCard/MovieDetailCard.css"
import NavBar from "../Component/Navbar.jsx"
import {Link} from 'react-router-dom';
import {movies} from "../MovieDetailPage/movies.js";
import { upcomingMovies } from "../MovieDetailPage/movies.js";
import MovRow from "../Component/MovieRow.jsx"

function Home(){
  const EEAAO = movies.find((m) => m.id === 2);

  return(
    <div className="body">
      <header class="site-header">
        <NavBar/>
      </header>

      <main class="container">
        <section className="welcome-container">
          <Link to={ `/movie/${EEAAO.id}/${EEAAO.title}`}>
          <section className="promoted-container">
            <img src={EEAAO.poster} className="PromotedPoster"/>
            <video src={EEAAO.trailer} muted autoPlay loop className="PromotedTrailer"></video>
          </section>
          </Link>
        </section>
        
      <MovRow rowslogan="Discover more!" link_addon="" movD={movies}/>

      <MovRow rowslogan="Coming soon!" link_addon="coming-soon/" movD={upcomingMovies}/>

  </main>


</div>

  );
}

export default Home;



