import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import './HomePage.css';

const HomePage = ({ token, setToken }) => {
  HomePage.propTypes = {
    token: PropTypes.string,
    setToken: PropTypes.func.isRequired
  };

  const navigate = useNavigate();

  const [events, setEvents] = useState([]); // Start with an empty events array
  const [activeTab, setActiveTab] = useState('Calendar'); // Track active tab (Calendar, Medications, etc.)

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
  
  const navBar = (tabName) => {
    const navElement = document.getElementById(tabName);
  
    if (tabName === 'Medications') {
      if (navElement) {
        navElement.style.display = "block";
      }
    } else if (tabName === 'Calendar') {
      //setShowCalendar(true);
      if (navElement) {
        navElement.style.display = "none";
      }
    } else {
      console.warn(`Element with id '${tabName}' does not exist.`);
    }
  };

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

export default HomePage;