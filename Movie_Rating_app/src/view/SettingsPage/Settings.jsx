import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Component/Navbar.jsx"
import "./Settings.css";

// Small hook to persist to localStorage
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // noop
    }
  }, [key, value]);

  return [value, setValue];
}

const DEFAULTS = {
  theme: "light", // 'light' | 'dark'
  ratingScale: 5,  // 5 or 10
  showAdult: false,
  emailNotifications: true,
  autoplayTrailers: false,
  language: "en", // simple example – you can wire this to i18n later
};

export default function Settings() {
  const [settings, setSettings] = useLocalStorage("movieapp:settings", DEFAULTS);

  // Apply theme to <html> for easy theming
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
  }, [settings.theme]);

  const version = useMemo(() => import.meta.env?.VITE_APP_VERSION || "1.0.0", []);

  function update(field, value) {
    setSettings(prev => ({ ...prev, [field]: value }));
  }

  function reset() {
    setSettings(DEFAULTS);
  }

  return (
    <>
    {/* full-width nav at the very top */}
    <header className="site-header">
      <NavBar />
    </header>

    {/* page shell caps width and holds title + grid */}
    <div className="settings-shell">
      <section className="settings-header">
        <h1>Settings</h1>
      </section>

      {}
      <div className="settings-container">
      <section className="card">
        <h2>Appearance</h2>
        <div className="row">
          <label htmlFor="theme">Theme</label>
          <div className="segmented">
            <button
              className={settings.theme === "light" ? "active" : ""}
              onClick={() => update("theme", "light")}
            >Light</button>
            <button
              className={settings.theme === "dark" ? "active" : ""}
              onClick={() => update("theme", "dark")}
            >Dark</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Ratings & Content</h2>
        <div className="row">
          <label htmlFor="ratingScale">Rating scale</label>
          <select
            id="ratingScale"
            value={String(settings.ratingScale)}
            onChange={e => update("ratingScale", Number(e.target.value))}
          >
            <option value="1">Out of 1 ★</option>
            <option value="2">Out of 2 ★</option>
            <option value="3">Out of 3 ★</option>
            <option value="4">Out of 4 ★</option>
            <option value="5">Out of 5 ★</option>
          </select>
        </div>
        <div className="row checkbox">
          <label>
            <input
              type="checkbox"
              checked={settings.showAdult}
              onChange={e => update("showAdult", e.target.checked)}
            />
            Show adult / R‑rated content
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Playback & Notifications</h2>
        <div className="row checkbox">
          <label>
            <input
              type="checkbox"
              checked={settings.autoplayTrailers}
              onChange={e => update("autoplayTrailers", e.target.checked)}
            />
            Autoplay trailers on movie pages
          </label>
        </div>
        <div className="row checkbox">
          <label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={e => update("emailNotifications", e.target.checked)}
            />
            Email me when a movie on my watchlist gets new reviews
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Localization</h2>
        <div className="row">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={settings.language}
            onChange={e => update("language", e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </section>

      <section className="card meta">
        <div className="row">
          <div>
            <h3>App Info</h3>
            <p>Version: {version}</p>
            <p>Settings are saved automatically to your browser.</p>
          </div>
          <div className="actions">
            <button className="btn secondary" onClick={reset}>Reset to defaults</button>
          </div>
        </div>
      </section>
      </div>
      </div>
      </>
  );
}