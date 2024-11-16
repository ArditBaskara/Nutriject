// src/pages/AuthPage.js

import React, { useState } from 'react';
import './AuthPage.css';
import Button from '../components/Button'; // Impor komponen Button
import Navbar from '../components/Navbar'; // Impor komponen Navbar

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (isLogin) {
      console.log('Login:', { email, password });
    } else {
      console.log('Signup:', { email, password });
    }
    alert(`${isLogin ? 'Login' : 'Signup'} Successful!`);
  };

  return (
    <div className="auth-container">
      <Navbar /> {/* Menambahkan Navbar */}
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit">
            {isLogin ? 'Login' : 'Signup'}
          </Button>
        </form>
        <p className="toggle-text">
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Signup' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
