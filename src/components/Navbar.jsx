import React from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi menggunakan react-router-dom
import './Navbar.css'; // File CSS untuk gaya navbar

const Navbar = () => {
  const navigate = useNavigate();

  // Fungsi untuk navigasi ke halaman onboarding
  const goBack = () => {
    navigate('/'); // Ubah '/onboarding' sesuai path Anda
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img
          src={require('../assets/Nutrijectlogo.png')} // Ganti dengan path logo Anda
          alt="Logo"
          className="logo-img"
        />
      </div>
      <button className="back-button" onClick={goBack}>
        Back to Onboarding
      </button>
    </div>
  );
};

export default Navbar;
