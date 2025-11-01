import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import './App.css'
import Browse from "./view/BrowsePage/browse.jsx"
import Home from "./view/HomePage/home.jsx"
import Login from "./view/LoginPage/Login.jsx"
import SignUp from "./view/SignUpPage/SignUp.jsx"
import WatchList from "./view/WatchListPage/watchlist.jsx"
import DiscussionPage from "./view/DiscussionPage/discussion.jsx"
import ComingSoon from "./view/ComingSoonPage/ComingSoon.jsx"
import {MovieDetailPage} from "./view/MovieDetailPage/MovieDetailPage.jsx"
import ContactUs from "./view/ContactUs/ContactUs.jsx"
import {UCMoiveDetailPage} from "./view/MovieDetailPage/MovieDetailPage.jsx"
import Profile from "./view/Profile/profile.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <LanguageProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/browse" element={<Browse/>}/>
        <Route path="/coming-soon" element={<ComingSoon/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/watchlist" element={<WatchList/>}/>
        <Route path="/discussions" element={<DiscussionPage/>}/>
        <Route path="/movie/:id/:title" element={<MovieDetailPage/>}/>
        <Route path="/ContactUs" element={<ContactUs/>}/>
        <Route path="/movie/coming-soon/:id/:title" element={<UCMoiveDetailPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
