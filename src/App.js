import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CreateAccount from './CreateAccount';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    login(username, password);
  };

function login(username, password) {
  fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => {
      if (!response.ok) throw new Error('Login failed');
      return response.json();
  })
  .then(data => {
      console.log('Login successful:', data);
  })
  .catch(error => console.error('Error:', error));
}

  return (
    <Router>
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
                  <form onSubmit={handleLogin} className="login-form">
                    <div>
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit">Login</button>
                  </form>
                  <p className="new-user-message">
                    New here? <Link to="/create-account">Create an account</Link>
                  </p>
                </div>
              }
            />
            {/* Create Account link */}
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
