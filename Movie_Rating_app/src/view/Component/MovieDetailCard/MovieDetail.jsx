import "./MovieDetailCard.css"

const MovieDetail = ({title, poster, trailer, genre, DOR, description, rating,casts,length })=>{
    return(
            <div className="Movie-Infor">
            <h1 className="MovieTitle">{title}</h1>
            <p>{DOR} • {rating} • {length}</p>
            <section className="visual-container">
                <img className="poster" src={poster}/>
                <video className="trailer" muted loop controls autoPlay>
                    <source src={trailer}/>
                </video>
            </section>
            <p className="Genre-Container">Genre: {genre}</p>
            <p className="description">{description}</p>
            <p className="Team-infor">{casts}</p>
        </div>

        
    );
}

export default MovieDetail;