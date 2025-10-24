import "./MovieDetailCard.css"
import "../../main.css"
import NavBar from "../Navbar.jsx"
import { useLang } from "../../../i18n/LanguageContext.jsx";



const MovieDetail = ({title, poster, trailer, genre, DOR, synopsis, rating,casts,length, studio, director, screenwriter, })=>{
    const { lang,setLang, t } = useLang();


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
                <p className="Genre-Container">
                    <strong>{t("genreLabel")}</strong> {genre}</p>
                <p className="description">{synopsis}</p>
                <div className="Team-infor">
                    <p><strong>{t("cast")}</strong> {casts}</p>
                    <p><strong>{t("studio")}</strong> {studio}</p>
                    <p><strong>{t("director")}</strong> {director}</p>
                    <p><strong>{t("screenwriter")}</strong> {screenwriter}</p>
                </div>
            </div> 
        </div>
        </>
    );
}

export default MovieDetail;

