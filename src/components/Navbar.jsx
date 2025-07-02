import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/Nutrijectlogo.png';

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const navigate = useNavigate();

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
          Beranda
        </NavLink>
        <NavLink to="/ocr" className="nav-link">
          Deteksi
        </NavLink>
        <NavLink to="/personalize" className="nav-link">
          Setting
        </NavLink>
        <NavLink to="/auth" className="nav-link">
          Login
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
