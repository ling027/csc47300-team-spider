import React, { useState } from "react";
import "./ContactUs.css";
import "../main.css"
import NavBar from "../Component/Navbar.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"; 

function ContactUs() {
    const { t } = useLang();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);


    return (
        <div className="body">

            <header class="site-header">
                <NavBar/>
            </header>

        <div className="ContactUs-container">
            <h1>{t("contactUs")}</h1>
            <h2>{t("feedback")}</h2>
            <form  className="enter-section">
                
                <label htmlFor="Name">{t("name")}</label>
                <input name="Name" placeholder={t("fullname")} className="Contactus-Input" required/>

                <label htmlFor="Email">{t("email")}</label>
                <input name="Email" placeholder={t("email")} className="Contactus-Input" required/>
                <label htmlFor="Message">{t("message")}</label>

                <input name="Message" placeholder={t("giveUsYourThoughts")} className="Contactus-Input" required/>  
                <button className="sub-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("submitting") : t("submit")}
                </button>
            </form>
            {message && <div className="feedback-message">{message}</div>}
        </div>
        </div>
    );
}

export default ContactUs;