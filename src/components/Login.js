import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import '../App.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validCredentials = [
    { username: 'Uniconnect', password: 'Uniconnect' },
    
    
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validCredentials.some(
      (cred) => cred.username === username && cred.password === password
    );

    if (isValid) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form p-4 border rounded shadow">
        <div className="text-center mb-4">
          <img
            src="https://www.uniconnectabroad.com/wp-content/uploads/2022/07/uniconnect_logo.jpg"
            alt="Uniconnect Logo"
            className="login-logo mb-3"
            style={{ maxWidth: '250px' }}
          />
          <h4>Login to Uniconnect</h4>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login; 