import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignedInProtection } from "./components/ProtectedRoute";
import './App.css'
import Browse from "./view/BrowsePage/browse.tsx"
import Home from "./view/HomePage/home.jsx"
import Login from "./view/LoginPage/Login"
import SignUp from "./view/SignUpPage/SignUp.tsx"
import WatchList from "./view/WatchListPage/watchlist"
import DiscussionPage from "./view/DiscussionPage/discussion"
import ComingSoon from "./view/ComingSoonPage/ComingSoon.jsx"
import {MovieDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import ContactUs from "./view/ContactUs/ContactUs.jsx"
import {UCMoiveDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import Profile from "./view/Profile/profile.jsx"
import Landing from './view/LandingPage/landing.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <LanguageProvider>
     
        <Router>
          <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/browse" element={<Browse/>}/>
            <Route path="/coming-soon" element={<ComingSoon/>}/>
            <Route path="/login" element={<SignedInProtection><Login/></SignedInProtection>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/watchlist" element={<ProtectedRoute><WatchList/></ProtectedRoute>} />
            <Route path="/discussions" element={<ProtectedRoute><DiscussionPage/></ProtectedRoute>}/>
            <Route path="/movie/:id/:title" element={<MovieDetailPage/>}/>
            <Route path="/ContactUs" element={<ContactUs/>}/>
            <Route path="/movie/coming-soon/:id/:title" element={<UCMoiveDetailPage/>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/" element={<Landing/>}/>
          </Routes>
        </Router>
  
    </LanguageProvider>
  );
}

export default App;
