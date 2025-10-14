import "../main.css"
import {Link, useNavigate} from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx"; 


function NavBar() {
    const { lang,setLang, t } = useLang();
    return (
        <nav className="navbar">
        <nav className="links">
            <Link to="/" className="nav-link">{t("home")}</Link>
            <Link to="/browse" className="nav-link">{t("browse")}</Link>
            <Link to="/coming-soon" className="nav-link">{t("comingSoon")}</Link>
            <Link to="/watchlist" className="nav-link">{t("watchlist")}</Link>
            <Link to="/Login" className="nav-link">{t("login")}</Link>
            <Link to="/contactus" className="nav-link">{t("contact")}</Link>
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