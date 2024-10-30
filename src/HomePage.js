import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null); // Reset the token on logout
    console.log('Logged out');
    navigate('/'); // Redirect to login page
  };

  console.log('Current Token:', token); // Debugging line to check the token

  return (
    <div className="homepage-container">
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '20px', top: '20px' }}> {/* Logout button */}
        Logout
      </button>
    </div>
  );  
};

export default HomePage;
