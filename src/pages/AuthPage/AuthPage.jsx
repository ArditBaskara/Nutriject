/* eslint-disable */

import React, { useState } from 'react';
import './AuthPage.css';
import '../onboarding/Onboarding.css';
import Button from '../../components/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  db,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from '../../firebase-config';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { encrypt, decrypt } from '../../crypt';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const usersRef = collection(db, 'users');

      if (isLogin) {
        const q = query(
          usersRef,
          where('email', '==', email),
          where('password', '==', password)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert('Invalid email or password.');
          return;
        }

        const userData = querySnapshot.docs[0].data();
        Cookies.set('enc', encrypt(userData), { expires: 7 });
        navigate('/');
      } else {
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          alert('Email already registered.');
          return;
        }

        await addDoc(usersRef, {
          name,
          email,
          password,
        });

        await addDoc(collection(db, 'reports'), {
          email,
          tanggal: new Date().toISOString().split('T')[0],
          carbs: 0,
          protein: 0,
          sugar: 0,
          fat: 0,
          salt: 0,
        });

        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Navbar />

      <main className="flex items-center justify-center py-24 mt-24 px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left illustration / marketing */}
          <div className="hidden md:flex flex-col items-start gap-6 pl-6">
            <img
              src="/hero/1.jpg"
              alt="Healthy food"
              className="w-full rounded-2xl shadow-lg object-cover h-72"
            />
            <div>
              <h3 className="text-3xl font-extrabold text-gray-800">
                Welcome to Nutriject
              </h3>
              <p className="mt-2 text-gray-600">
                Track nutrition effortlessly. Scan labels, snap foods, or log
                manually — all in one place.
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  AI-powered detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Personalized suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  Fast, private, and simple
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div className="mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isLogin
                      ? 'Sign in to continue to Nutriject'
                      : 'Sign up and start tracking your nutrition'}
                  </p>
                </div>
                <img src={'./icon-1.png'} alt="logo" className="w-12 h-12" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-2.5 text-sm text-gray-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                )}

                {isSuccess && (
                  <div className="text-sm text-green-600">
                    Sukses membuat akun — silakan login
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold shadow hover:bg-orange-600 transition"
                >
                  {isLogin ? 'Login' : 'Create account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">or continue with</p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:shadow">
                    {' '}
                    <img
                      src="/icon-1.png"
                      alt="google"
                      className="w-5 h-5"
                    />{' '}
                    Google{' '}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:shadow">
                    {' '}
                    <svg
                      className="w-5 h-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3H15v7A10 10 0 0022 12z" />
                    </svg>{' '}
                    Facebook{' '}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      onClick={toggleLogin}
                      className="text-green-600 font-semibold"
                    >
                      Create one
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={toggleLogin}
                      className="text-green-600 font-semibold"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
