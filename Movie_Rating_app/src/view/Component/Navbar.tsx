import { useState } from "react";
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
import { HiMenu, HiX } from "react-icons/hi";

function NavBar() {
  const { lang, setLang, t } = useLang();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/home");
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger menu button */}
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div 
          className="nav-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <button 
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <HiX />
          </button>
        </div>

        <div className="nav-links">
          <Link to="/home" className="nav-link" onClick={handleLinkClick}>
            <IoHomeOutline />
            <span>{t("home")}</span>
          </Link>
          <Link to="/browse" className="nav-link" onClick={handleLinkClick}>
            <IoSearchSharp />
            <span>{t("browse")}</span>
          </Link>
          <Link to="/coming-soon" className="nav-link" onClick={handleLinkClick}>
            <MdMovieFilter />
            <span>{t("comingSoon")}</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/watchlist" className="nav-link" onClick={handleLinkClick}>
                <FaRegBookmark />
                <span>{t("watchlist")}</span>
              </Link>
              <Link to="/discussions" className="nav-link" onClick={handleLinkClick}>
                💬 <span>Discussion</span>
              </Link>
              <Link to="/profile" className="nav-link" onClick={handleLinkClick}>
                <FaUserLarge />
                <span>{user?.username || "Profile"}</span>
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-link">
              <TbLogout2 />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="nav-link" onClick={handleLinkClick}>
              <TbLogin2 />
              <span>{t("login")}</span>
            </Link>
          )}
          <Link to="/contactus" className="nav-link" onClick={handleLinkClick}>
            <MdContactSupport />
            <span>{t("contact")}</span>
          </Link>
        </div>

        <div className="nav-footer">
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
    </>
  );
}

export default NavBar;

