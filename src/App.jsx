// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Home from "./components/Home";  // Import Home component

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home route */}
        <Route path="/" element={<Home />} />
        {/* Routes for signup, login, and chat */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
