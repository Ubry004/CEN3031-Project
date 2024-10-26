import React, { useState } from 'react';
import './CreateAccount.css';

function CreateAccount() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('New Account - First Name:', firstName);
    console.log('New Account - Last Name:', lastName);
    console.log('New Account - Email:', email);
    console.log('New Account - Username:', username);
    console.log('New Account - Password:', password);
    register(firstName, lastName, email, username, password);
  };

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
        console.log('Registration successful:', data);
    })
    .catch(error => console.error('Error:', error));
  }

  return (
    <div className="create-account">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignUp} className='signup-form'>
        <div>
            <label htmlFor="first-name">First Name:</label>
            <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="last-name">Last Name:</label>
            <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div>
          <label htmlFor="new-username">Username:</label>
          <input
            type="text"
            id="new-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">Password:</label>
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default CreateAccount;
