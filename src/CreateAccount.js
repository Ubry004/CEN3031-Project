import React, { useState } from 'react';
import './CreateAccount.css';

function CreateAccount() {
  // State variables to store user input
  const [userType, setUserType] = useState('Patient'); // Default userType selection
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [hospitalId, setHospitalId] = useState('');

  // Function to handle form submission for account creation
  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('New Account - User Type:', userType);
    console.log('New Account - First Name:', firstName);
    console.log('New Account - Last Name:', lastName);
    console.log('New Account - Email:', email);
    console.log('New Account - Username:', username);
    console.log('New Account - Password:', password);
    if (userType === 'Doctor' || userType === 'Operator') {
      console.log('New Account - Hospital ID:', hospitalId); // Log Hospital ID if applicable
    }
    // Call the register function with user input values
    register(firstName, lastName, email, username, password); //NEED TO UPDATE WHEN BACKEND IS READY
  };

  // Function to handle user registration via API
  function register(firstName, lastName, email, username, password) { //NEED TO UPDATE WHEN BACKEND IS READY
    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, username, password })
    })
    .then(response => {
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    })
    .then(data => {
        console.log('Registration successful:', data); // Log successful registration
    })
    .catch(error => console.error('Error:', error)); // Log any errors encountered
  }

  return (
    <div className="create-account"> {/* Main container for the account creation form */}
      <h1>Create an Account</h1> {/* Header for the form */}
      <form onSubmit={handleSignUp} className='signup-form'> {/* Signup form */}
      <div>
          <label htmlFor="user-type">User Type: </label>
          <select
            id="user-type"
            className="dropdown"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Operator">Operator</option>
          </select>
        </div>
        {/* Hospital ID input, visible only if userType is "Doctor" or "Operator" */}
        {(userType === 'Doctor' || userType === 'Operator') && (
          <div>
            <label htmlFor="hospital-id">Hospital ID: </label>
            <input
              type="text"
              id="hospital-id"
              className="text-entry"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              required
            />
          </div>
        )}
        <div>
            <label htmlFor="first-name">First Name: </label>
            <input
                type="text"
                id="first-name"
                className="text-entry"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} // Update first name state
                required  // Input is required
            />
        </div>
        <div>
            <label htmlFor="last-name">Last Name: </label>
            <input
                type="text"
                id="last-name"
                className="text-entry"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} // Update last name state
                required
            />
        </div>
        <div>
            <label htmlFor="email">Email: </label>
            <input
                type="email"
                id="email"
                className="text-entry"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                required
            />
        </div>
        <div>
          <label htmlFor="new-username">Username: </label>
          <input
            type="text"
            id="new-username"
            className="text-entry"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">Password: </label>
          <input
            type="password"
            id="new-password"
            className="text-entry"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>
        <button type="submit">Sign Up</button> {/* Submit button */}
      </form>
    </div>
  );
}

export default CreateAccount;
