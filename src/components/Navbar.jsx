import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/Nutrijectlogo.png';
import Cookies from 'js-cookie';
import { decrypt } from '../crypt';

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const navigate = useNavigate();

  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar ${isShrunk ? 'shrink' : ''}`}>
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Nutriject Logo" className="logo-img" />
        <h1 className="logo-title">NUTRIJECT</h1>
      </div>

      <nav className="nav-links">
        <NavLink exact="true" to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/setting" className="nav-link">
          Setting
        </NavLink>
        {user ? (
        <NavLink to="/personalize" className="nav-link">
          Profile
        </NavLink>
        ) : (
        <NavLink to="/auth" className="nav-link">
          Login
        </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
