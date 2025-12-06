import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { ProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute";
import { SignedInProtection } from "./components/ProtectedRoute";
import './App.css'
import Landing from "./view/LandingPage/Landing"
import Browse from "./view/BrowsePage/browse.tsx"
import Home from "./view/HomePage/home.tsx"
import Login from "./view/LoginPage/Login"
import SignUp from "./view/SignUpPage/SignUp.tsx"
import WatchList from "./view/WatchListPage/watchlist"
import DiscussionPage from "./view/DiscussionPage/discussion"
import ComingSoon from "./view/ComingSoonPage/ComingSoon.tsx"
import {MovieDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import ContactUs from "./view/ContactUs/ContactUs.jsx"
import {UCMoiveDetailPage} from "./view/MovieDetailPage/MovieDetailPage.tsx"
import Profile from "./view/Profile/profile.tsx"
import AdminDashboard from "./view/AdminPage/AdminDashboard.tsx"

function App() {
  return (
    <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/browse" element={<Browse/>}/>
            <Route path="/coming-soon" element={<ComingSoon/>}/>
            <Route path="/login" element={<SignedInProtection><Login/></SignedInProtection>}/>
            <Route path="/signup" element={<SignedInProtection><SignUp/></SignedInProtection>}/>
            <Route path="/watchlist" element={<ProtectedRoute><WatchList/></ProtectedRoute>} />
            <Route path="/discussions" element={<ProtectedRoute><DiscussionPage/></ProtectedRoute>}/>
            <Route path="/movie/:id/:title" element={<MovieDetailPage/>}/>
            <Route path="/ContactUs" element={<ContactUs/>}/>
            <Route path="/movie/coming-soon/:id/:title" element={<UCMoiveDetailPage/>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
          </Routes>
        </Router>
    </LanguageProvider>
  );
}

export default App;

