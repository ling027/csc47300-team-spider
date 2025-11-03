import "../main.css";
import "./Login.css";
import NavBar from "../Component/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const { login } = useAuth();


  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!savedUser) {
      setMessage(" No user found. Please sign up first.");
      return;
    }

    const isMatch =
      (formData.username === savedUser.username ||
        formData.username === savedUser.email) &&
      formData.password === savedUser.password;

    if (isMatch) {
      login(savedUser); 
      setMessage(`✅ Welcome back, ${savedUser.fullname || savedUser.username}!`);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMessage("Invalid username or password.");
    }
  };

  return (
    <div className="body">
      <header className="site-header">
        <NavBar />
      </header>

      <main className="login-page">
        <div className="login-container">
          <h1>{t("login")}</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">{t("username")}</label>
            <br />
            <input
              type="text"
              className="login-input"
              name="username"
              placeholder={t("yourUsername")}
              value={formData.username}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="password">{t("password")}</label>
            <br />
            <input
              type="password"
              className="login-input"
              name="password"
              placeholder={t("yourPassword")}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <br />

            <button type="submit" className="login-button">
              {t("login")}
            </button>

            {message && (
              <p
                style={{
                  marginTop: "10px",
                  color: message.includes("❌") ? "#ff5555" : "#00ff88",
                }}
              >
                {message}
              </p>
            )}
          </form>

          <Link to="/SignUp" className="signup-link">
            {t("noAccount")}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;
