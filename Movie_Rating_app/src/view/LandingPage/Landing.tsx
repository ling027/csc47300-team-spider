import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext.jsx';
import './Landing.css';
import { IoStarOutline, IoBookmarkOutline, IoChatbubblesOutline } from 'react-icons/io5';
import heroImage from '../../assets/hero-star.png';

function Landing(): React.ReactElement {
  const { t } = useLang();

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-image-container">
          <img src={heroImage} alt="Movie Rating Hero" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="landing-content">
          <h1 className="landing-title">Movie Tracker</h1>
          <p className="landing-subtitle">
            Discover, Rate, and Discuss Your Favorite Movies
          </p>
          <p className="landing-description">
            Your ultimate destination for movie enthusiasts. Browse thousands of films, 
            create personalized watchlists, rate your favorites, and join vibrant 
            discussions with fellow movie lovers.
          </p>

          <div className="landing-features">
            <div className="feature-card">
              <IoStarOutline className="feature-icon" />
              <h3>Rate Movies</h3>
              <p>Share your opinions with detailed ratings</p>
            </div>
            <div className="feature-card">
              <IoBookmarkOutline className="feature-icon" />
              <h3>Watchlists</h3>
              <p>Create and manage your movie collections</p>
            </div>
            <div className="feature-card">
              <IoChatbubblesOutline className="feature-icon" />
              <h3>Discussions</h3>
              <p>Engage with the community</p>
            </div>
          </div>

          <div className="landing-actions">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create Account
            </Link>
            <Link to="/home" className="btn-secondary">
               Just Checking!
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Landing;