import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      // Send username and password to the backend
      const response = await axios.post('http://localhost:5000/login', { username, password });
  
      if (response.status === 200) {
        onLogin(true); 
        navigate('/'); 
      }
    } catch (err) {
      console.error("Login error:", err); // Log error for debugging
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login">
      <h1 className="heading">ATC Netpulse</h1>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
