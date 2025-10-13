import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail.jsx"
import trailer from "../../assets/InceptionTrailer.mp4"

function Inception() {
  return (
    <MovieDetailCard
      title="Inception"
      poster="https://c8.alamy.com/comp/2JH2PW0/movie-poster-inception-2010-2JH2PW0.jpg"
      trailer={trailer}
      genre="Action, Sci-Fi"
      DOR="July 16, 2010"
      description={`Acclaimed filmmaker Christopher Nolan directs an international cast in an original sci-fi actioner that travels around the globe and into the intimate and infinite world of dreams. Dom Cobb (Leonardo DiCaprio) is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible—inception.`}
      rating="R"
      casts={`Cast: Leonardo DiCaprio, Ken Watanabe, Joseph Gordon-Levitt, Marion Cotillard, Ellen Page, Tom Hardy, Cillian Murphy, Tom Berenger, Michael Caine

Studio: Warner Bros. Pictures
Director: Christopher Nolan
Screenwriter: Christopher Nolan
Genre: Action, Sci-Fi`}
      length="148 min"
    />
  );
}

export default Inception;
