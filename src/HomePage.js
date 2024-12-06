import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import './HomePage.css';

const HomePage = ({ token, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // State to hold event data
  const [medications, setMedications] = useState([]); // State to hold medication data
  const [activeTab, setActiveTab] = useState('Calendar'); // Track active tab (Calendar, Medications, Profile)
  let [userID, setUserID] = useState(null); // State to store the user ID
  let [userRole, setUserRole] = useState(null);
  let [username, setUsername] = useState(null);
  let [firstName, setFirstName] = useState(null);
  let [lastName, setLastName] = useState(null);
  let [email, setEmail] = useState(null);
  let [hospitalID, setHospitalID] = useState(null);
  

  const getuserID = async (email) => {
    try {
      console.log('Fetching user ID for email:', email);
      const response = await fetch(`/fetch_user_id/${email}`);
      if (!response.ok) {
        throw new Error(`Error fetching user ID: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('User ID:', data.UserID);
      return data.UserID;
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  };

  useEffect(() => {
    const userInfoFromState = location.state || {};
    if (userInfoFromState && !token) {
      //console.log('User information from userInfoFromState:', userInfoFromState);

      setUserRole(userInfoFromState.userRole.toLowerCase()); // Update userRole only once when userInfoFromState changes
      setUsername(userInfoFromState.username);
      setFirstName(userInfoFromState.firstName);
      setLastName(userInfoFromState.lastName);
      setEmail(userInfoFromState.email);
      setHospitalID(userInfoFromState.hospitalID);
      // console.log('calling setuserID');
      const fetchUserID = async () => { // Async function to fetch user ID to displau on profile (would return a promise before)
        const id = await getuserID(userInfoFromState.email);
        setUserID(id); // Update userID after resolving
      };
  
      fetchUserID(); // Call the async function
      console.log('Role from userInfoFromState:', userInfoFromState.userRole);
      console.log('Username from userInfoFromState:', userInfoFromState.username);
      console.log('First Name from userInfoFromState:', userInfoFromState.firstName);
      console.log('Last Name from userInfoFromState:', userInfoFromState.lastName);
      console.log('Email from userInfoFromState:', userInfoFromState.email);
      console.log('Hospital ID from userInfoFromState:', userInfoFromState.hospitalID);
    } else {
      try {
        const userInfo = jwtDecode(token);
        //console.log('Decoded token:', userInfo);
        setUserID(userInfo.sub.UserID);
        setUserRole(userInfo.sub.Role);
        setUsername(userInfo.sub.Username);
        setFirstName(userInfo.sub.FirstName);
        setLastName(userInfo.sub.LastName);
        setEmail(userInfo.sub.Email);
        setHospitalID(userInfo.sub.HospitalID);
        // console.log('User ID from token:', userInfo.sub.UserID);
        // console.log('Role from token:', userInfo.sub.Role);
        // console.log('Username from token:', userInfo.sub.Username);
        // console.log('First Name from token:', userInfo.sub.FirstName);
        // console.log('Last Name from token:', userInfo.sub.LastName);
        // console.log('Email from token:', userInfo.sub.Email);
        // console.log('Hospital ID from token:', userInfo.sub.HospitalID);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [location.state, token]); // Trigger this effect only when location.state or token changes

  useEffect(() => {
    if (userID && userRole) {
    fillCalendar(userID, userRole);
    fillMedications(userID, userRole);
    }
}, [userID, userRole]);

  const fillCalendar = async (userID, userRole) => {
    try {
      // Fetch appointments from the backend
      let url;
      if (userRole === 'patient') {
        console.log("Fetching appointments for patient ID:", userID);
        url = `/fetch_user_appointments/${userID}`;
      } else if (userRole === 'doctor' || userRole === 'operator') {
        console.log("Fetching appointments for userRole:", userRole);
        url = `/fetch_all_appointments`;
      }
      const response = await fetch(url);
      console.log("Response:", response);
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No appointments found.");
          return;
        }
        throw new Error(`Error fetching appointments: ${response.statusText}`);
      }
  
      const data = await response.json();
      const appointments = data.appointments;
  
      // Map backend appointments to FullCalendar event format
      //console.log("Appointment:", appointments);
      const formattedEvents = appointments.map((appointment) => {
        const rawDate = appointment[1];
      
        // Convert the raw date string to a Date object
        const parsedDate = new Date(rawDate);
        //console.log("Parsed date:", parsedDate);
        // Check if the Date object is valid
        if (isNaN(parsedDate)) {
          console.error("Invalid date:", rawDate);
          return null; // Skip this appointment if the date is invalid
        }
      
        // Format the date as ISO 8601 string (remove the time zone part)
        const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
        //console.log("Formatted date:", formattedDate);
        return {
          // id: appointment[0],  // AppointmentID
          title: appointment[2], // Description
          start: formattedDate // Date object in correct format
        };
      });
      // console.log("Formatted events:", formattedEvents);
      // Update FullCalendar events
      setEvents(formattedEvents);

  
      //console.log("Calendar successfully filled with appointments:", formattedEvents);
    } catch (error) {
      console.error("Error filling calendar:", error);
    }
  };

  const fillMedications = async (userID, userRole) => {
    try {
      // Fetch medications from the backend
      let url;
      if (userRole === 'patient') {
        console.log("Fetching medications for patient ID:", userID);
        url = `/fetch_user_medications/${userID}`;
      } else if (userRole === 'doctor' || userRole === 'operator') {
        console.log("Fetching medications for userRole:", userRole);
        url = `/fetch_all_medications`;
      }
      const response = await fetch(url);
      console.log("Response:", response);
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No medications found.");
          return;
        }
        throw new Error(`Error fetching medications: ${response.statusText}`);
      }
  
      const data = await response.json();
      const medications = data.medications;
  
      // Map backend medications to medication format
      //console.log("Medications:", medications);
      const formattedMedications = medications.map((medication) => {
        const rawStartDate = medication[5];
        const rawEndDate = medication[6];

        const parsedStartDate = new Date(rawStartDate);
        const parsedEndDate = new Date(rawEndDate);
        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
          console.error("Invalid date:", rawStartDate);
          console.error("Invalid date:", rawEndDate);
          return null;
        }
      
        // Format the date as ISO 8601 string (remove the time zone part)
        const formattedStartDate = parsedStartDate.toISOString().slice(0, 10).replace("T", " ");
        const formattedEndDate = parsedEndDate.toISOString().slice(0, 10).replace("T", " ");
        return {
          title: medication[2],
          dosage: medication[3],
          frequency: medication[4],
          start_date: formattedStartDate,
          end_date: formattedEndDate
        };
      });
      console.log("Formatted medications:", formattedMedications);
      // Update FullCalendar events
      setMedications(formattedMedications);

  
      //console.log("Calendar successfully filled with appointments:", formattedEvents);
    } catch (error) {
      console.error("Error filling medications:", error);
    }
  };

  const addNewEvent = async () => {
    const title = prompt("Enter event title:");
    const start = prompt("Enter start date (YYYY-MM-DD HH:MM:SS):");
  
    // Check if all details are provided
    if (title && start) {
      // Assuming user-related info is stored in local state or retrieved dynamically
      console.log("addNewEvent userID:", userID);
      const user_id = userID; // Replace with actual user ID (from token or app state)
      const doctor_id = 3; // Replace with actual doctor ID if applicable (3 for now)
      const description = title; // Use title as the description
  
      // Prepare the data payload
      const eventData = {
        user_id,
        doctor_id,
        appointment_date: start,
        description,
      };
  
      try {
        // Call the backend API
        const response = await fetch('/set_appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
  
        // Handle the response
        if (response.ok) {
          const result = await response.json();
          console.log("Appointment saved successfully:", result);

          const newEvent = {
            // id: user_id,
            title: description,
            start: start,
          };
          //console.log("New event:", newEvent);
          // Add the new event to the calendar if the backend operation succeeds
          fillCalendar(userID, userRole); // Refill the calendar with updated appointments
          //console.log("Events after adding new event:", events); // This will show the updated events after state update

        } else {
          const error = await response.json();
          alert(`Failed to add event: ${error.msg}`);
          console.error("Error:", error);
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("A network error occurred. Please try again.");
      }
    } else {
      alert("Please fill in all event details.");
    }
  };

  const addNewMed = async () => {
    // Much of the same as above, but for medications
    const medication_name = prompt("Enter Medication Name:");
    const dosage = prompt("What is the dosage of the medication?");
    const frequency = prompt("What is the frequency of the medication?");
    const start_date = prompt("Enter start date (YYYY-MM-DD):");
    const end_date = prompt("Enter end date (YYYY-MM-DD):");

    if (medication_name && dosage && frequency && start_date && end_date) {
      const user_id = userID;
      const medicationData = {
        user_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        end_date,
      };

      try {
        const response = await fetch('/set_medication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medicationData),
        });

        if (response.ok) {
          const result = await response.json();
          //console.log("Medication saved successfully:", result);

          const newMed = {
            title: medication_name,
            dosage: dosage,
            frequency: frequency,
            start_date: start_date,
            end_date: end_date,
          };
          console.log("New medication:", newMed);
          fillMedications(userID, userRole);

        } else {
          const error = await response.json();
          alert(`Failed to add event: ${error.msg}`);
          console.error("Error:", error);
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("A network error occurred. Please try again.");
      }
    }
  };
  
  const handleEventClick = (clickInfo) => { // Basic popup on event click
    const { title, start} = clickInfo.event;
    alert(`Title: ${title}\nStart: ${start.toISOString().slice(0, 10)}`);
  };

  const handleLogout = () => {
    setToken(null); // Reset the token on logout
    setEvents([]); // Clear the events array
    setMedications([]); // Clear the medications array
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
        <p>Welcome <strong>{username || 'Not available'}</strong></p>
        <div className="tabs">
          <button id="AptTab" className="tablink" onClick={activeTab === 'Calendar' ? addNewEvent : addNewMed}>
            {activeTab === 'Calendar' ? 'Add Appointment' : 'Add Medication'}
          </button>
          <button className="tablink" onClick={() => toggleView('Calendar')}>Calendar</button>
          <button className="tablink" onClick={() => toggleView('Medications')}>Medications</button>
          <button className="tablink" onClick={() => toggleView('Profile')}>Profile</button>
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
              start: "title",
              end: "prev,next"
            }}
          />
        </div>
      )}
      {/* Display Medications content only if activeTab is "Medications" */}
      {activeTab === 'Medications' && (
        <div id="Medications" className="tabcontent">
          <h1>Medications</h1>
          <ul>
        {medications.map((med, index) => (
          <li key={index}>
            <strong>{med.title}</strong> ◦ Dosage: {med.dosage} <br /> ◦ Frequency: {med.frequency} 
            <br /> ◦ Start Date: {med.start_date} <br /> ◦ End Date: {med.end_date}
          </li>
        ))}
      </ul>
        </div>
      )}
      {/* Display Profile content only if activeTab is "Profile" */}
      {activeTab === 'Profile' && (
        <div id="Profile" className="tabcontent">
          <h1>Profile</h1>
          <p><strong>User ID:</strong> {userID || 'Not available'}</p>
          <p><strong>Role:</strong> {userRole || 'Not available'}</p>
          <p><strong>Username:</strong> {username || 'Not available'}</p>
          <p><strong>First Name:</strong> {firstName || 'Not available'}</p>
          <p><strong>Last Name:</strong> {lastName || 'Not available'}</p>
          <p><strong>Email:</strong> {email || 'Not available'}</p>
          <p><strong>Hospital ID:</strong> {hospitalID || 'Not available'}</p>
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