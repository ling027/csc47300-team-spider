import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom"
import './App.css'
import Browse from "./view/BrowsePage/browse.jsx"
import Home from "./view/HomePage/home.jsx"
import Login from "./view/LoginPage/Login.jsx"
import SignUp from "./view/SignUpPage/SignUp.jsx"
import WatchList from "./view/WatchListPage/watchlist.jsx"
import Inception from "./view/MovieDetail/InceptionDetail.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/browse" element={<Browse/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/watchlist" element={<WatchList/>}/>
      <Route path="/inception" element={<Inception/>}/>
    </Routes>
  )
}

export default App
