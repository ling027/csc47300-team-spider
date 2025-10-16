import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

import "./App.css";
import Browse from "./view/BrowsePage/browse.jsx";
import Home from "./view/HomePage/home.jsx";
import Login from "./view/LoginPage/Login.jsx";
import SignUp from "./view/SignUpPage/SignUp.jsx";
import WatchList from "./view/WatchListPage/watchlist.jsx";
import ComingSoon from "./view/ComingSoonPage/ComingSoon.jsx";
import ContactUs from "./view/Contacts/ContactUs.jsx";
import { MovieDetailPage, UCMoiveDetailPage } from "./view/MovieDetailPage/MovieDetailPage.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ContactUs" element={<ContactUs />} />

          {/* Details pages */}
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/movie/coming-soon/:id" element={<UCMoiveDetailPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
