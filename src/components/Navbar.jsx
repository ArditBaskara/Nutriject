import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/Nutrijectlogo.png';  // Ganti dengan path logo Anda

const Navbar = () => {
  const navigate = useNavigate();
  const [isShrunk, setIsShrunk] = useState(false);

  // Fungsi untuk menangani scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsShrunk(true);  // Mengubah state untuk menyusutkan navbar saat scroll
    } else {
      setIsShrunk(false); // Kembali ke keadaan semula
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={`navbar ${isShrunk ? 'shrink' : ''}`}>
      <div className="logo">
        <img
          src={logo}
          alt="Nutriject Logo"
          className="logo-img"
          onError={(e) => (e.target.style.display = 'none')}  // Menyembunyikan gambar jika error
        />
      </div>
      <button className="back-button" onClick={goBack}>
        Back to Onboarding
      </button>
    </div>
  );
};

export default Navbar;
