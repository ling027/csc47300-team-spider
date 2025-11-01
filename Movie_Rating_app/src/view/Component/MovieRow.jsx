import "../main.css"
import {Link} from 'react-router-dom';
import { useFormatters } from "../../utils/formatHelpers.js";

// Convert TMDB rating (0-10 scale) to stars (0-5 scale)
function getStars(ratingValue) {
  let numericRating = 0;
  
  // Handle different input types
  if (typeof ratingValue === 'number') {
    numericRating = ratingValue;
  } else if (typeof ratingValue === 'string') {
    // Try to extract number from strings like "8.5/10" or "8.5"
    const match = ratingValue.match(/(\d+\.?\d*)/);
    if (match) {
      numericRating = parseFloat(match[1]);
      // If the string contains "/10", assume it's already on 0-10 scale
      // Otherwise, assume it might be on a different scale
      if (!ratingValue.includes('/10')) {
        // If it's just a number, assume it could be 0-5 scale, convert to 0-10
        if (numericRating <= 5) {
          numericRating = numericRating * 2;
        }
      }
    }
  }
  
  if (!numericRating || numericRating === 0) return '☆ ☆ ☆ ☆ ☆';
  
  // Ensure rating is on 0-10 scale, then convert to 0-5 scale
  if (numericRating > 10) {
    numericRating = (numericRating / 2); // If somehow > 10, normalize
  }
  
  const starRating = (numericRating / 2);
  
  // Round to nearest whole star for cleaner display
  const filledStars = Math.round(starRating);
  
  // Build star string (5 stars total)
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars += '★ ';
    } else {
      stars += '☆ ';
    }
  }
  
  return stars.trim();
}

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
                        <p class="stars">{getStars(movie.ratingValue !== undefined ? movie.ratingValue : movie.rating)}</p>
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
               <p class="stars">{getStars(movie.ratingValue !== undefined ? movie.ratingValue : movie.rating)}</p>
            </Link>
        </div>
      ))}
      </section>
    </>
  );

};

export default MovRow;