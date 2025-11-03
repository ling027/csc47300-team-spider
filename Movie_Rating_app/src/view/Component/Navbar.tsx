import "../main.css";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext.tsx";
import { IoHomeOutline, IoSearchSharp } from "react-icons/io5";
import { MdMovieFilter, MdContactSupport } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { TbLogout2 } from 'react-icons/tb';
import { FaUserLarge } from 'react-icons/fa6';
import { TbLogin2 } from 'react-icons/tb';

function NavBar() {
  const { lang, setLang, t } = useLang();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <nav className="navbar">
      <div className="links">
        <Link to="/home" className="nav-link"><IoHomeOutline />{t("home")}</Link>
        <Link to="/browse" className="nav-link"> <IoSearchSharp />{t("browse")}</Link>
        <Link to="/coming-soon" className="nav-link"><MdMovieFilter />{t("comingSoon")}</Link>

        {isLoggedIn ? (
          <>
            <Link to="/watchlist" className="nav-link"><FaRegBookmark />{t("watchlist")}</Link>
            <Link to="/discussions" className="nav-link">💬 Discussion</Link>
            <Link to="/profile" className="nav-link"><FaUserLarge/>{user?.username || "Profile"}</Link>

            <button onClick={handleLogout} className="logout-button">
              <TbLogout2/>Logout
            </button>
          </>
        ) : (
          <Link to="/Login" className="nav-link">
            <TbLogin2/>Login
          </Link>
        )}

        <Link to="/contactus" className="nav-link"><MdContactSupport />{t("contact")}</Link>
      </div>

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

