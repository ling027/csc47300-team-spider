import "./MovieDetailCard.css"
import "../../main.css"
import NavBar from "../Navbar.jsx"


const MovieDetail = ({title, poster, trailer, genre, DOR, synopsis, rating,casts,length })=>{
    return(
        <>
        <header className="site-header">
            <NavBar/>
        </header>
        
        <div className="Movie-Infor">
           
            <div className="MovieDetail-Container"> 
                <h1 className="MovieTitle">{title}</h1>
                <p>{DOR} • {rating} • {length}</p>
                <section className="visual-container">
                    <img className="MoviePoster" src={poster}/>
                    <video className="trailer" muted loop controls autoPlay>
                        <source src={trailer}/>
                    </video>
                </section>
                <p className="Genre-Container">Genre: {genre}</p>
                <p className="description">{synopsis}</p>
                <p className="Team-infor">{casts}</p>
            </div> 
        </div>
        </>
    );
}

export default MovieDetail;

