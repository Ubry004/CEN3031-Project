import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import CreateAccount from './CreateAccount';
import HomePage from './HomePage';

function App() {
  // State variables for username, password, and authentication token
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null); // State to store the token
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle form submission for login
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    login(username, password).then(success => {
      if (success) navigate('/home'); // Navigate to home after login
    }).catch(error => console.error('Login failed:', error)); // Log error if login fails
  };

  // Asynchronous function to handle login logic
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({ username, password }), // Send username and password as JSON
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      setToken(data.access_token); // Store the token in state
      console.log('Login successful:', data);
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          {/* Login Page */}
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to Medi-Cal</h1>
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="login-form"> {/* Login form */}
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // Update username state
                      required // Input is required
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Update password state
                      required // Input is required
                    />
                  </div>
                  <button type="submit">Login</button> {/* Submit button */}
                </form>
                <p className="new-user-message">
                  New here? <Link to="/create-account">Create an account</Link> {/* Link to create account */}
                </p>
              </div>
            }
          />
          <Route path="/create-account" element={<CreateAccount />} /> {/* Route for create account */}
          <Route path="/home" element={<HomePage token={token} setToken={setToken} />} /> {/* Route for home page */}
        </Routes>
      </header>
    </div>
  );
}

export default App;
