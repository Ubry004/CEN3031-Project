import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ token, setToken }) => {
  HomePage.propTypes = {
    token: PropTypes.string, // or PropTypes.string.isRequired if it's always required
    setToken: PropTypes.func.isRequired
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null); // Reset the token on logout
    console.log('Logged out');
    navigate('/'); // Redirect to login page
  };

  console.log('Current Token:', token); // Debugging line to check the token

  const navBar = (cityName, element, color) => {  // copied from https://www.w3schools.com/howto/howto_js_tab_header.asp
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
    const navElement = document.getElementById(cityName);
    if (navElement) {
      navElement.style.display = "block";
      element.style.backgroundColor = color;
      console.log(`Updated ${cityName} tab with color ${color}`);
    } else {
      console.error(`Element with id ${cityName} not found`);
    }
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo"> {/* Placeholder for logo */}
          Medi-Cal
        </div>
        <div className="tabs">
          <button className="tablink" onClick={(e) => navBar('Calendar', e.target, 'red')}>Calendar</button>
          <button className="tablink" onClick={(e) => navBar('Medications', e.target, 'green')}>Medications</button>
          <button className="tablink" onClick={(e) => navBar('Appointments', e.target, 'blue')}>Appointments</button>
          <button className="tablink" onClick={(e) => navBar('Other', e.target, 'orange')}>Other</button>
          <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        </div>
      </header>
      <div id="Calendar" className="tabcontent">
        <h1>Calendar</h1>
        <p> . . . </p>
      </div>
      <div id="Medications" className="tabcontent">
        <h1>Medications</h1>
        <p> . . . </p>
      </div>
      <div id="Appointments" className="tabcontent">
        <h1>Appointments</h1>
        <p> . . . </p>
      </div>
      <div id="Other" className="tabcontent">
        <h1>Other</h1>
        <p> . . . </p>
      </div>
    </div>
  );
};

export default HomePage;
