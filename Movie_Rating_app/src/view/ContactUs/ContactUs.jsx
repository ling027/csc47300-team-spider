import React, { useState } from "react";
import "./ContactUs.css";
import "../main.css"
import NavBar from "../Component/Navbar.jsx"

function ContactUs() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);


    return (
        <div className="body">

            <header class="site-header">
                <NavBar/>
            </header>

        <div className="ContactUs-container">
            <h1>Contact us</h1>
            <h2>Give us your feedback</h2>
            <form  className="enter-section">
                
                <label htmlFor="Name">Name</label>
                <input name="Name" placeholder="Your Name" className="Contactus-Input" required/>

                <label htmlFor="Email">Email</label>
                <input name="Email" placeholder="Your Email" className="Contactus-Input" required/>
                <label htmlFor="Message">Message</label>

                <input name="Message" placeholder="Give us your thoughts!" className="Contactus-Input" required/>  
                <button className="sub-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {message && <div className="feedback-message">{message}</div>}
        </div>
        </div>
    );
}

export default ContactUs;