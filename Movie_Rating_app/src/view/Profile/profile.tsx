import "./profile.css";
import "../main.css";
import NavBar from "../Component/Navbar";
import { useLang } from "../../i18n/LanguageContext";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface FavoriteMovie {
  id: number;
  title: string;
  poster: string;
  rating: string;
  releaseDate?: string;
}

interface UserStats {
  minutesWatched: number;
  moviesWatched: number;
  avgRating: number;
}

interface UserProfile {
  username: string;
  email: string;
  joined: string;
  avatar: string;
  stats: UserStats;
}

type DailyActivityMap = Record<string, number>;

interface MonthItem {
  month: string;
  year: number;
  date: Date;
}

const Profile: React.FC = () => {
  const { t } = useLang();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const existingUser = JSON.parse(localStorage.getItem("user") || "null");

  const [user] = useState<UserProfile>({
    username: "Test User",
    email: "test@gmail.com",
    joined: "March 2024",
    avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    stats: {
      minutesWatched: 8720,
      moviesWatched: 48,
      avgRating: 8.9,
    },
  });

  // Load bookmarks
  useEffect(() => {
    const saved: FavoriteMovie[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setFavorites(saved);
  }, []);

  const removeBookmark = (id: number) => {
    const updated = favorites.filter((m) => m.id !== id);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setFavorites(updated);
  };

  const dailyActivity: DailyActivityMap = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
    const data: DailyActivityMap = {};
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      data[key] = Math.floor(Math.random() * 5);
    }
    return data;
  }, []);

  const months: MonthItem[] = useMemo(() => {
    const list: MonthItem[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      list.push({ month, year, date });
    }
    return list;
  }, []);

  const getMonthGrid = (year: number, monthIndex: number): (Date | null)[][] => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = new Array(7).fill(null);
    let currentDay = 0;

    for (let i = firstDay.getDay(); i < 7; i++) {
      currentDay++;
      week[i] = new Date(year, monthIndex, currentDay);
    }
    weeks.push(week);

    while (currentDay < daysInMonth) {
      const newWeek: (Date | null)[] = [];
      for (let i = 0; i < 7; i++) {
        currentDay++;
        newWeek.push(
          currentDay <= daysInMonth ? new Date(year, monthIndex, currentDay) : null
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
          <div className="profile-main">
            {/* Profile Header */}
            <div className="profile-header">
              <img src={user.avatar} alt="User avatar" className="profile-avatar" />
              <div className="profile-info">
                <h2>{existingUser.username}</h2>
                <p>{existingUser.email}</p>
                <p className="joined-date">{t("Joined")}: {user.joined}</p>
                <button className="edit-btn">{t("Edit Profile")}</button>
              </div>
            </div>

            {/* Bookmarks */}
            <div className="favorites-section">
              <h3>Bookmarked Movies</h3>
              <div className="fav-movies-row">
                {favorites.length === 0 ? (
                  <p style={{textAlign:"center", color:"white"}}>You haven’t bookmarked any movies yet.</p>
                ) : (
                  favorites.map((movie) => (
                    <div key={movie.id} className="favorite-card">
                      <Link to={`/movie/${movie.id}/${movie.title}`}>
                        <img src={movie.poster} alt={movie.title}  className="favorite-poster"/>
                        <p className="favorite-title">{movie.title}</p>
                        <p className="favorite-rating">{movie.rating}</p>
                      </Link>
                      <button className="remove-button" onClick={() => removeBookmark(movie.id)}>Remove</button>
                    </div>
                  ))
                )}
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
                              if (!day)
                                return <div key={dIndex} className="day-cell empty"></div>;
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
