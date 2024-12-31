 // src/components/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   // If the user is already logged in, redirect to the chat page
  //   if (token) {
  //     navigate("/chat");
  //   }
  // }, [token, navigate]);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to Blink Chat!</h2>
      <p>To continue, please sign up or log in</p>
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Home;
