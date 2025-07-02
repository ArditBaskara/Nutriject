import React, { useState } from 'react';
import './AuthPage.css';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import {db, doc, setDoc, getDoc, addDoc, collection} from "../firebase-config"
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import {encrypt, decrypt} from "../crypt"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi password
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    if (isLogin) {
      const data = {email, password};
      const response = await axios.post("https://nutriject-server.vercel.app/user/login", data);
      const res = response.data;
      if(res.status !== 200){
        console.log(res.message);
        return;
      }
      Cookies.set("enc", encrypt(res), {expires:7})
      navigate("/");
      
    } else {
      try{
        const data = {email, password, name};
        const response = await axios.post("https://nutriject-server.vercel.app/user/signup", data);
        setIsSuccess(true);
      }catch(err){
        console.log(err)
      }
      
    }
  };
  

  return (
    <div className="auth-container">
      <Navbar /> {/* Menambahkan Navbar */}
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
            <label htmlFor="email">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          )}
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
          {isSuccess & !isLogin && (<p style={{color:'green'}}>Sukses membuat akun</p>)}
          <Button type="submit" bgCol={'blue'}>
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
