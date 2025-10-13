import { useParams } from "react-router-dom";
import {movies} from "./movies.js";
import MovieDetailCard from "../Component/MovieDetailCard/MovieDetail.jsx";

const MovieDetailPage = ()=>{
    const {id}=useParams();
    const movie=movies.find((m)=> m.id===parseInt(id));

    if (!movie) return <p>Movie not found</p>;

    return(
        <MovieDetailCard
           title={movie.title}
           poster={movie.poster}
           trailer={movie.trailer}
           genre={movie.genre}S
            DOR={movie.DOR}
            description={movie.description}
            rating={movie.rating}
            casts={movie.casts}
            length={movie.length}
        />

    );
};

export default MovieDetailPage;

