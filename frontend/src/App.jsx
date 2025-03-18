import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/login";  
import Signup from "./components/signup";
import Navbar from "./components/nav";
import Dashboard from "./components/dash"
import Sidebar from "./components/Sidebar";
import HotelDetail from "./components/Hotels";

function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
