import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapChart from './MapChart';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user was previously authenticated
  useEffect(() => {
    const auth = localStorage.getItem('uniconnect_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('uniconnect_auth', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('uniconnect_auth');
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <img
            src="https://www.uniconnectabroad.com/wp-content/uploads/2022/07/uniconnect_logo.jpg" 
            alt="Logo"
            className="top-right-image"
          />
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger position-absolute" 
            style={{ top: '20px', left: '20px' }}
          >
            Logout
          </button>
          <MapChart />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
