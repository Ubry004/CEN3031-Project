import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import './HomePage.css';

const HomePage = ({ token, setToken }) => {
  const location = useLocation();
  const { firstName, lastName, email, username, hospitalID, userRole } = location.state || {};

  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Start with an empty events array
  const [activeTab, setActiveTab] = useState('Calendar'); // Track active tab (Calendar, Medications, etc.)

  // Decode the token
  //console.log('Token in HomePage:', token);

  if (!location.state) {
    try {
      let userInfo = jwtDecode(token);
      const userID = userInfo.sub.UserID;
      const username = userInfo.sub.Username;
      const firstName = userInfo.sub.FirstName;
      const lastName = userInfo.sub.LastName;
      const email = userInfo.sub.Email;
      const userRole = userInfo.sub.Role;
      const hospitalID = userInfo.sub.HospitalID;
      console.log('User ID:', userID);
      console.log('Username:', username);
      console.log('First Name:', firstName);
      console.log('Last Name:', lastName);
      console.log('Email:', email);
      console.log('Role:', userRole);
      console.log('Hospital ID:', hospitalID);
    } catch (error) {
      console.error('Invalid token:', error);
      return <p>Invalid token. Please log in again.</p>;
    }
  } else {
    console.log('User information from location state:', location.state);
    console.log('User ID: Use getter from backend');
    console.log('Username:', username);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Role:', userRole);
    console.log('Hospital ID:', hospitalID);
  }


  const addEvent = () => {
    const title = prompt("Enter event title:");
    const start = prompt("Enter start date (YYYY-MM-DD):");

    // Check if all details are provided
    if (title && start) {
      // Add new event to the events array
      setEvents([...events, { title, start}]);
    } else {
      alert("Please fill in all event details.");
    }
  };

  const handleEventClick = (clickInfo) => { // Basic popup on event click
    const { title, start} = clickInfo.event;
    alert(`Title: ${title}\nStart: ${start.toISOString().slice(0, 10)}`);
  };

  const handleLogout = () => {
    setToken(null); // Reset the token on logout
    console.log('Logged out');
    navigate('/'); // Redirect to login page
  };

  //console.log('Current Token:', token); // Debugging line to check the token


  const toggleView = (view) => {
    setActiveTab(view);
    console.log('Active Tab:', activeTab);
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">Medi-Cal</div>
        <div className="tabs">
          <button className="tablink" onClick={addEvent}>Add Appointment</button>
          <button className="tablink" onClick={() => toggleView('Calendar')}>Calendar</button>
          <button className="tablink" onClick={() => toggleView('Medications')}>Medications</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Display FullCalendar only if activeTab is "Calendar" */}
      {activeTab === 'Calendar' && (
        <div id="Calendar">
          <FullCalendar
            plugins={[dayGridPlugin, InteractionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              start: "today",
              center: "title",
              end: "prev,next"
            }}
          />
        </div>
      )}
      {/* Display Medications content only if activeTab is "Medications" */}
      {activeTab === 'Medications' && (
        <div id="Medications" className="tabcontent">
          <h1>Medications</h1>
          <p>Medications go here...</p>
        </div>
      )}
    </div>
  );
};

HomePage.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired
};

export default HomePage;