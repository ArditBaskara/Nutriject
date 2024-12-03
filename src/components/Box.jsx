// src/components/Box.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Box.css';

function Box({ images, title, coinAmount, claimText, registerText, navto}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  // Ganti gambar secara otomatis setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const onCobaClicked = () => {
    navigate(navto);
  }

  return (
    <div className="Box">
      <div className="header">
        <h2 className="title">{title}</h2>
      </div>
      <div className="slider-container">
        <img
          src={images[currentImageIndex]}
          alt="Food item"
          className="slider-image"
        />
      </div>
      <div className="footer">
        <p className="claim-text">{claimText}</p>
        <p className="register-text">{registerText}</p>
        <button className="register-button" onClick={onCobaClicked}>Coba</button>
      </div>
    </div>
  );
}

export default Box;
