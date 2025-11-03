import "../main.css"
import "./Signup.css"
import {Link} from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx"; 

function SignUp(){
    const { t } = useLang();

    return(
        <div className="body">

        <main class="signup-page">
            <div class="signup-container" >
                <h1>{t("signUp")}</h1>
                <form action="/signup" method="post">
                <label for ="fullname">{t("fullname")}</label>
                <br/>
                <input type="text" class="signup-input" name="fullname" placeholder={t("yourFirstAndLastName")} required />
                <br />

                <label for ="Email">{t("email")}</label>
                <br/>
                <input type="text" class="signup-input" name="Email" placeholder={t("email")} />
                <br />

                <label for="username">{t("username")}</label>
                 <br />
                <input type="text" class="signup-input" name="username" placeholder={t("yourUsername")} required />
                <br />

                <label for="password">{t("password")}</label>
                 <br />
                <input type="password" class="signup-input" name="password" placeholder={t("yourPassword")} required />
                <br />

                <label for="Re-enter_password">{t("reenterPassword")}</label>
                 <br />
                <input type="password" class="signup-input" name="Re-enter_password" placeholder={t("reenterYourPassword")} required />
                <br />
                
                <button type="submit" class="login-button">{t("signUpButton")}</button>
            </form>

             <Link to="/Login" class="signup-link">Already have an account? Login</Link>
        </div>
        </main>
    </div>

    );
}

export default SignUp;
    