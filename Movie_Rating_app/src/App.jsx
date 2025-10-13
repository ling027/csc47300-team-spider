import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import Browse from "./view/BrowsePage/browse.jsx"
import Home from "./view/HomePage/home.jsx"
import Login from "./view/LoginPage/Login.jsx"
import SignUp from "./view/SignUpPage/SignUp.jsx"
import WatchList from "./view/WatchListPage/watchlist.jsx"
import Inception from "./view/MovieDetailPage/InceptionDetail.jsx"
import MovieDetailPage from "./view/MovieDetailPage/MovieDetailPage.jsx"
import ContactUs from "./view/ContactUs/ContactUs.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/browse" element={<Browse/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/watchlist" element={<WatchList/>}/>
        <Route path="/inception" element={<Inception/>}/>
        <Route path="/movie/:id" element={<MovieDetailPage/>}/>
        <Route path="/ContactUs" element={<ContactUs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
