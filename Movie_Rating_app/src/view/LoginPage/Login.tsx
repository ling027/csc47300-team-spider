import "../main.css";
import "./Login.css";
import NavBar from "../Component/Navbar.jsx";
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from "../../i18n/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext";
import { useState, type FormEvent } from 'react';

function Login(): React.ReactElement {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX (simulating API call)
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username.trim(), password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="body">     
      <header className="site-header">
        <NavBar/>
      </header>

      <main className="login-page">
        <div className="login-container">
          <h1>{t("login")}</h1>
          {error && (
            <div style={{ 
              color: '#ef4444', 
              backgroundColor: '#fee2e2', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">{t("username")}</label>
            <br/>
            <input 
              type="text" 
              className="login-input" 
              id="username"
              name="username" 
              placeholder={t("yourUsername")} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <br />
            <label htmlFor="password">{t("password")}</label>
            <br/>
            <input 
              type="password" 
              className="login-input" 
              id="password"
              name="password"  
              placeholder={t("yourPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : t("login")}
            </button>
          </form>

          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem' }}>Demo Account:</p>
            <p>Username: <strong>demo</strong> / Password: <strong>demo123</strong></p>
          </div>

          <Link to="/signup" className="signup-link">{t("noAccount")}</Link>
        </div>
      </main>
    </div>
  );
}

export default Login;

