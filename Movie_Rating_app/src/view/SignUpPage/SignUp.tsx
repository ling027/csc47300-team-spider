import "../main.css";
import "./Signup.css";
import NavBar from "../Component/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import React, { useState } from "react";

const SignUp: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    reenter: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 20;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (password.length < minLength || password.length > maxLength) {
      return `Password must be between ${minLength} and ${maxLength} characters`;
    }

    if (!regex.test(password)) {
      return " Password must include uppercase, lowercase, number, and special character";
    }

    return "";
  };

  const validatedEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    return "";
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.reenter) {
      setMessage("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    const emailError = validatedEmail(formData.email);
    if (emailError) {
      setMessage(emailError);
      return;
    }

    if (!formData.fullname || !formData.email || !formData.username) {
      setMessage("Please fill out all required fields");
      return;
    }

    const existingUser = JSON.parse(localStorage.getItem("user") || "null");
    if (existingUser && existingUser.email === formData.email) {
      setMessage("User already exists. Please log in instead.");
      return;
    }

    if (existingUser && existingUser.username === formData.username) {
      setMessage("User already exists. Please log in instead.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: formData.fullname,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
    );

    setMessage("Sign up successful! Redirecting...");
    setTimeout(() => navigate("/Login"), 1500);
  };

  return (
    <div className="body">
      <section className="site-header">
        <NavBar />
      </section>

      <main className="signup-page">
        <div className="signup-container">
          <h1>{t("signUp")}</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullname">{t("fullname")}</label>
            <br/>
            <input
              type="text"
              className="signup-input"
              name="fullname"
              placeholder={t("yourFirstAndLastName")}
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <br/>

            <label htmlFor="email">{t("email")}</label>
             <br/>
            <input
              type="email"
              className="signup-input"
              name="email"
              placeholder={t("email")}
              value={formData.email}
              onChange={handleChange}
              required
            />
             <br/>

            <label htmlFor="username">{t("username")}</label>
             <br/>
            <input
              type="text"
              className="signup-input"
              name="username"
              placeholder={t("yourUsername")}
              value={formData.username}
              onChange={handleChange}
              required
            />
             <br/>

            <label htmlFor="password">{t("password")}</label>
             <br/>
            <input
              type="password"
              className="signup-input"
              name="password"
              placeholder={t("yourPassword")}
              value={formData.password}
              onChange={handleChange}
              required
            />
             <br/>

            <label htmlFor="reenter">{t("reenterPassword")}</label>
             <br/>
            <input
              type="password"
              className="signup-input"
              name="reenter"
              placeholder={t("reenterYourPassword")}
              value={formData.reenter}
              onChange={handleChange}
              required
            />
             <br/>

            <button type="submit" className="login-button">
              {t("signUpButton")}
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

          <Link to="/Login" className="signup-link">
            Already have an account? Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
