import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import './App.css'
import Landing from "./view/LandingPage/Landing"
import Browse from "./view/BrowsePage/browse.tsx"
import Home from "./view/HomePage/home.jsx"
import Login from "./view/LoginPage/Login"
import SignUp from "./view/SignUpPage/SignUp.jsx"
import WatchList from "./view/WatchListPage/watchlist"
import DiscussionPage from "./view/DiscussionPage/discussion"
import ComingSoon from "./view/ComingSoonPage/ComingSoon.jsx"
import {MovieDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import ContactUs from "./view/ContactUs/ContactUs.jsx"
import {UCMoiveDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import Profile from "./view/Profile/profile.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute>
                  <Browse/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/coming-soon" 
              element={
                <ProtectedRoute>
                  <ComingSoon/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <WatchList/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/discussions" 
              element={
                <ProtectedRoute>
                  <DiscussionPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/movie/:id/:title" 
              element={
                <ProtectedRoute>
                  <MovieDetailPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/ContactUs" 
              element={
                <ProtectedRoute>
                  <ContactUs/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/movie/coming-soon/:id/:title" 
              element={
                <ProtectedRoute>
                  <UCMoiveDetailPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
