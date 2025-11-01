import "./profile.css";
import "../main.css";
import NavBar from "../Component/Navbar.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { useMemo, useState } from "react";

function Profile() {
  const { t } = useLang();
  const [user] = useState({
    username: "MovieFan123",
    email: "moviefan@example.com",
    joined: "March 2024",
    avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    stats: {
      minutesWatched: 8720,
      moviesWatched: 48,
      avgRating: 8.9,
    },
    favorites:[
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        { title: "The Shawshank Redemption", poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg", rating: 9.0 },
        
    ]
  });

  // --- Generate fake daily activity data for 1 year ---
  const dailyActivity = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
    const data = {};
    for (
      let d = new Date(start);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const key = d.toISOString().split("T")[0];
      data[key] = Math.floor(Math.random() * 5); // 0–4 intensity
    }
    return data;
  }, []);

  // --- Generate months (past 12 months) ---
  const months = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      list.push({ month, year, date });
    }
    return list;
  }, []);

  // --- Generate calendar grid for each month ---
  const getMonthGrid = (year, monthIndex) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let week = new Array(7).fill(null);
    let currentDay = 0;

    // Offset for the first day
    for (let i = firstDay.getDay(); i < 7; i++) {
      currentDay++;
      week[i] = new Date(year, monthIndex, currentDay);
    }
    weeks.push(week);

    while (currentDay < daysInMonth) {
      const newWeek = [];
      for (let i = 0; i < 7; i++) {
        currentDay++;
        newWeek.push(
          currentDay <= daysInMonth
            ? new Date(year, monthIndex, currentDay)
            : null
        );
      }
      weeks.push(newWeek);
    }

    return weeks;
  };

  return (
    <>
      <section className="site-header">
        <NavBar />
      </section>

      <div className="profile-body">
        <div className="profile-layout">
          {/* Left Column */}
          <div className="profile-main">
            {/* Profile Header */}
            <div className="profile-header">
              <img src={user.avatar} alt="User avatar" className="profile-avatar" />
              <div className="profile-info">
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p className="joined-date">
                  {t("Joined")}: {user.joined}
                </p>
                <button className="edit-btn">{t("Edit Profile")}</button>
              </div>
            </div>
            
           {/* Favorite Movies */}
            <div className="favorites-section">
              <h3>Favorite Movies</h3>
              <div className="fav-movies-row">
                {user.favorites.map((movie, index) => (
                  <div key={index} className="favorite-card">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="favorite-poster"
                    />
                    <p className="favorite-title">{movie.title}</p>
                    <p className="favorite-rating">⭐ {movie.rating}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution Activity */}
            <div className="activity-section">
              <h3 className="activity-subtitle">{t("Contribution Activity")}</h3>
              <p className="activity-subtitle">
                {t("Your activity over the past year")}
              </p>

              <div className="activity-year">
                {months.map(({ month, year, date }) => {
                  const grid = getMonthGrid(year, date.getMonth());
                  return (
                    <div key={month + year} className="month-calendar">
                      <h4 className="month-title">{month}</h4>
                      <div className="month-grid">
                        {grid.map((week, wIndex) => (
                          <div key={wIndex} className="week-row">
                            {week.map((day, dIndex) => {
                              if (!day) return <div key={dIndex} className="day-cell empty"></div>;
                              const key = day.toISOString().split("T")[0];
                              const level = dailyActivity[key] || 0;
                              return (
                                <div
                                  key={dIndex}
                                  className={`day-cell level-${level}`}
                                  title={`${day.toDateString()} — ${level} actions`}
                                ></div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <p className="activity-legend">
                {t("Less")}{" "}
                <span className="legend-sample level-1"></span>
                <span className="legend-sample level-2"></span>
                <span className="legend-sample level-3"></span>
                <span className="legend-sample level-4"></span> {t("More")}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
          <aside className="profile-stats">
            <h3>{t("Your Stats")}</h3>
            <div className="stat-box">
              <p className="stat-label">{t("Minutes Watched")}</p>
              <p className="stat-value">
                {user.stats.minutesWatched.toLocaleString()}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">{t("Movies Watched")}</p>
              <p className="stat-value">{user.stats.moviesWatched}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">{t("Average Rating Given")}</p>
              <p className="stat-value">{user.stats.avgRating}</p>
            </div>
          </aside>
            <aside className="profile-stats">
            <h3>{t("Your Stats")}</h3>
            <div className="stat-box">
              <p className="stat-label">{t("Minutes Watched")}</p>
              <p className="stat-value">
                {user.stats.minutesWatched.toLocaleString()}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">{t("Movies Watched")}</p>
              <p className="stat-value">{user.stats.moviesWatched}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">{t("Average Rating Given")}</p>
              <p className="stat-value">{user.stats.avgRating}</p>
            </div>
          </aside>
        </div>

        </div>
      </div>
    </>
  );
}

export default Profile;
