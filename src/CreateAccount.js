import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';

function CreateAccount() {
  // State variables to store user input
  const [userRole, setUserRole] = useState('Patient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [hospitalID, setHospitalID] = useState(null);

  const navigate = useNavigate();

  // Function to handle form submission for account creation
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('New Account - User Role:', userRole);
    console.log('New Account - First Name:', firstName);
    console.log('New Account - Last Name:', lastName);
    console.log('New Account - Email:', email);
    console.log('New Account - Username:', username);
    console.log('New Account - Password:', password);
    if (userRole === 'Doctor' || userRole === 'Operator') {
      console.log('New Account - Hospital ID:', hospitalID); // Log Hospital ID if applicable
    }
    // Call the register function with user input values
    try {
      await register(firstName, lastName, email, username, password, hospitalID, userRole); 
      navigate('/home', { 
        state: { 
          firstName, 
          lastName, 
          email, 
          username,
          hospitalID, 
          userRole 
        }
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error:', error); // Log the error and prevent navigation
    }
  };

  // Function to handle user registration via API
  async function register(firstName, lastName, email, username, password, hospitalID, userRole) {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, username, password, hospitalID, userRole })
      });
  
      if (!response.ok) {
        // Get error details from the response if available
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
  
      const data = await response.json();
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Error in register function:', error.message);
      throw error; // Rethrow the error to handle it in `handleSignUp`
    }
  }

  return (
    <div className="create-account"> {/* Main container for the account creation form */}
      <h1>Create an Account</h1> {/* Header for the form */}
      <form onSubmit={handleSignUp} className='signup-form'> {/* Signup form */}
      <div>
          <label htmlFor="user-role">User Role: </label>
          <select
            id="user-role"
            className="dropdown"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            required
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Operator">Operator</option>
          </select>
        </div>
        {/* Hospital ID input, visible only if userRole is "Doctor" or "Operator" */}
        {(userRole === 'Doctor' || userRole === 'Operator') && (
          <div>
            <label htmlFor="hospital-id">Hospital ID: </label>
            <input
              type="number"
              id="hospital-id"
              className="text-entry"
              value={hospitalID}
              onChange={(e) => setHospitalID(e.target.value)}
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
