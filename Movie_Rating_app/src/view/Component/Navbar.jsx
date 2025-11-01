import "../main.css"
import {Link, useNavigate} from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx"; 
import { IoHomeOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { MdMovieFilter } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";


function NavBar() {
    const { lang,setLang, t } = useLang();
    return (
        <nav className="navbar">
        <nav className="links">
            <Link to="/" className="nav-link"><IoHomeOutline />{ t("home")}</Link>
            <Link to="/browse" className="nav-link"><IoSearchSharp/>{t("browse")}</Link>
            <Link to="/coming-soon" className="nav-link"><MdMovieFilter/>{t("comingSoon")}</Link>
            <Link to="/watchlist" className="nav-link"> <FaRegBookmark/>{t("watchlist")}</Link>
            <Link to="/discussions" className="nav-link">💬 Discussions</Link>
            <Link to="/Login" className="nav-link"><IoLogInOutline/>{t("login")}</Link>
            <Link to="/contactus" className="nav-link"><MdContactSupport/>{t("contact")}</Link>
            <Link to="/profile" className="nav-link"><MdContactSupport/>Profile</Link>
        </nav>

            <div className="nav-right">
                <label className="lang-label" htmlFor="lang-select" aria-label="language">
                🌐
                </label>
                <select
                    id="lang-select"
                    className="lang-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                >
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Spanish</option>
                    <option value="el">🇬🇷 Greek</option>
                </select>
            </div>
        </nav>
    );
}
export default NavBar;