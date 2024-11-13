// src/pages/Onboarding.jsx
import React from 'react';
import './Onboarding.css'; // Impor CSS khusus untuk animasi
import logo from '../assets/Male User.png'; // Impor logo dari folder assets

function Onboarding() {
  return (
    <div className="onboarding-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 className="onboarding-title">NUTRIJECT!</h1>
      <p className="onboarding-description">
        KLSDLKFLKSDFNLSFNLSKDFNLSNFSKLNSKLNSKLFNSLKNSDLKSLKNSDKLFNSLFNSKLFNSLFNSL!
      </p>
      <button className="get-started-button">Mulai Sekarang</button>
    </div>
  );
}

export default Onboarding;
