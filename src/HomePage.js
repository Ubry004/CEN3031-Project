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

  const handleEventClick = (clickInfo) => { // Basic function to make popup on event click
    const { title, start} = clickInfo.event;
    alert(`Title: ${title}\nStart: ${start.toISOString().slice(0, 10)}`);
  };

  const handleLogout = () => {
    setToken(null); // Reset the token on logout
    console.log('Logged out');
    navigate('/'); // Redirect to login page
  };

  console.log('Current Token:', token); // Debugging line to check the token

  const navBar = (cityName, element, color) => {
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
        <div className="logo">
          Medi-Cal
        </div>
        <div className="tabs">
          <button className="tablink" onClick={addEvent}>Add Appointments</button>
          <button className="tablink" onClick={(e) => navBar('Medications', e.target, 'green')}>Medications</button>
          <button className="tablink" onClick={(e) => navBar('Other', e.target, 'orange')}>Other</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div id="Calendar">
        <FullCalendar
          plugins={[dayGridPlugin,InteractionPlugin]}
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
