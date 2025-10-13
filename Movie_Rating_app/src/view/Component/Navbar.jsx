import "../main.css"
import {Link, useNavigate} from 'react-router-dom';


function NavBar() {
    return (
        <nav className="links">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/watchlist">Watch List</Link>
            <Link to="/Login">Login</Link>
            <Link to="/SignUp">SignUp</Link>
            <Link to="/contactus">Contact Us</Link>
        </nav>
    );
}
export default NavBar;