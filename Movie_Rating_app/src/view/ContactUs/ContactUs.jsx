import React, { useState } from "react";
import "./ContactUs.css";
import "../main.css"
import NavBar from "../Component/Navbar.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"; 

function ContactUs() {
    const { t } = useLang();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

   const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "73a75559-7457-419c-bb86-4364dcf97bfb",
          ...formData
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



    return (
        <div className="body">

            <header class="site-header">
                <NavBar/>
            </header>

        <div className="ContactUs-container">
            <h1>{t("contactUs")}</h1>
            <h2>{t("feedback")}</h2>
            <form  className="enter-section" onSubmit={handleSubmit}>
                
                <label htmlFor="Name">{t("name")}</label>
                <input 
                    name="name" 
                    placeholder={t("fullname")} 
                    className="Contactus-Input" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Email">{t("email")}</label>
                <input 
                    name="email" 
                    placeholder={t("email")} 
                    className="Contactus-Input" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                
                <label htmlFor="Message">{t("message")}</label>
                <input 
                    name="message" 
                    placeholder={t("giveUsYourThoughts")} 
                    className="Message-Input" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                />  
                <button className="sub-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("submitting") : t("submit")}
                </button>
            </form>
        </div>
        </div>
    );
}

export default ContactUs;