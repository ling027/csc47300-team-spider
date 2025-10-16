import "../main.css"
import "./Login.css"
import NavBar from "../Component/Navbar.jsx"
import {Link, useNavigate} from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx"; 

function Login(){
    const { t } = useLang();

    return(
        <div className="body">     
        <header class="site-header">
           <NavBar/>
        </header>

        <main class="login-page">
            
        <div class="login-container" >
            <h1>{t("login")}</h1>
            <form action="/login" method="post">
                <label for="username">{t("username")}</label>
                <br/>
                <input type="text" class="login-input" name="username" placeholder={t("yourUsername")} required />
                <br />
                <label for="password">{t("password")}</label>
                <br/>
                <input type="password" class="login-input" name="password"  placeholder={t("yourPassword")} />
                <br />
                <button type="submit" class="login-button">{t("login")}</button>
            </form>

            <Link to="/SignUp" class="signup-link">{t("noAccount")}</Link>
        </div>
        </main>
    </div>

    );
}

export default Login;

   