import { useParams } from "react-router-dom";
import {movies} from "./movies.js";
import { upcomingMovies } from "./movies.js";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail.jsx";
import "./MovieDetailPage.css"

function MDP({movDP}){
    const {id}=useParams();
    const movie=movDP.find((m)=> m.id===parseInt(id));

    if (!movie) return <p>Movie not found</p>;

    return(
        <div className="Movie-datail-container">
            <div>
                <MovieDetailCard
                    title={movie.title}
                    poster={movie.poster}
                    trailer={movie.trailer}
                    genre={movie.genre}S
                    DOR={movie.DOR}
                    synopsis={movie.synopsis}
                    rating={movie.rating}
                    casts={movie.casts}
                    length={movie.length}
                />

                <section className="comment-container">
                    <section className="comment-section">
                        <input name="Message" placeholder="Give us your thoughts!" className="comment" required/>  
                        <button className="comment-btn" type="submit" >
                            Submit
                        </button>
                    </section>
                    <section className="comments">

                    </section>
                </section>
            </div>

        
        </div>
    );

}
export const MovieDetailPage = ()=>{
    return(
        <MDP movDP={movies}/>
    );
};

export const UCMoiveDetailPage = ()=>{
   return(
        <MDP movDP={upcomingMovies}/>
   );
};




