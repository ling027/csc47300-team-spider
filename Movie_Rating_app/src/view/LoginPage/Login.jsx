import "../main.css"
import "./Login.css"
import NavBar from "../Component/Navbar.jsx"
import {Link, useNavigate} from 'react-router-dom';

function Login(){
    return(
        <div className="body">     
        <header class="site-header">
           <NavBar/>
        </header>

        <main class="login-page">
            
        <div class="login-container" >
            <h1>Login</h1>
            <form action="/login" method="post">
                <label for="username">Username:</label>
                <br/>
                <input type="text" class="login-input" name="username" placeholder="Your Username" required />
                <br />
                <label for="password">Password:</label>
                <br/>
                <input type="password" class="login-input" name="password"  placeholder="Your Password" />
                <br />
                <button type="submit" class="login-button">Login</button>
            </form>

            <Link to="/SignUp" class="signup-link">Don't have an account? Sign Up</Link>
        </div>
        </main>
    </div>

    );
}

export default Login;

   