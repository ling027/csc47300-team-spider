import { Link, useLocation } from 'react-router-dom';
import './MinimalNavbar.css';

function MinimalNavbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="minimal-navbar">
      <Link 
        to="/home" 
        className={`minimal-nav-link ${isActive('/home') ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/browse" 
        className={`minimal-nav-link ${isActive('/browse') ? 'active' : ''}`}
      >
        Browse
      </Link>
      <Link 
        to="/watchlist" 
        className={`minimal-nav-link ${isActive('/watchlist') ? 'active' : ''}`}
      >
        Watchlist
      </Link>
      <Link 
        to="/discussions" 
        className={`minimal-nav-link ${isActive('/discussions') ? 'active' : ''}`}
      >
        Discussion
      </Link>
    </nav>
  );
}

export default MinimalNavbar;

