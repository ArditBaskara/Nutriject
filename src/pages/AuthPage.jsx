import React, { useState } from 'react';
import './AuthPage.css';
import './Onboarding.css'
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {db, addDoc, collection, query, where, getDocs} from "../firebase-config"
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import {encrypt, decrypt} from "../crypt"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const usersRef = collection(db, "users");

      if (isLogin) {
        const q = query(usersRef, where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Invalid email or password.");
          return;
        }

        const userData = querySnapshot.docs[0].data();
        Cookies.set("enc", encrypt(userData), { expires: 7 });
        navigate("/");
      } else {
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          alert("Email already registered.");
          return;
        }

        await addDoc(usersRef, {
          name,
          email,
          password
        });

        await addDoc(collection(db, "reports"), {
          email,
          tanggal: new Date().toISOString().split("T")[0],
          carbs: 0,
          protein: 0,
          sugar: 0,
          fat: 0,
          salt: 0
        });

        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  

  return (
    <div>
      <Navbar />
      <div className="auth-container">
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
            {!isLogin && (<p style={{color:'green'}}>Sukses membuat akun</p>)}
            <button type="submit" className="get-started-button">
              {isLogin ? 'Login' : 'Signup'}
            </button>
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
      <Footer />
    </div>
  );
};

export default AuthPage;
