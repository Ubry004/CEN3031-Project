import React, { useState } from 'react';
import './CreateAccount.css';

function CreateAccount() {
  // State variables to store user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Function to handle form submission for account creation
  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Log the input values to the console for debugging
    console.log('New Account - First Name:', firstName);
    console.log('New Account - Last Name:', lastName);
    console.log('New Account - Email:', email);
    console.log('New Account - Username:', username);
    console.log('New Account - Password:', password);
    // Call the register function with user input values
    register(firstName, lastName, email, username, password);
  };

  // Function to handle user registration via API
  function register(firstName, lastName, email, username, password) {
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
      <h2>Create an Account</h2> {/* Header for the form */}
      <form onSubmit={handleSignUp} className='signup-form'> {/* Signup form */}
        <div>
            <label htmlFor="first-name">First Name:</label>
            <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} // Update first name state
                required  // Input is required
            />
        </div>
        <div>
            <label htmlFor="last-name">Last Name:</label>
            <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} // Update last name state
                required
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                required
            />
        </div>
        <div>
          <label htmlFor="new-username">Username:</label>
          <input
            type="text"
            id="new-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">Password:</label>
          <input
            type="password"
            id="new-password"
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
