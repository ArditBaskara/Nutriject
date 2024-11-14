// src/pages/Onboarding.jsx
import React from 'react';
import './Onboarding.css'; // Import CSS for Onboarding styles
import logo from '../assets/Nutrijectlogo.png'; // Import logo
import Box from '../components/Box'; // Import the Box component
import kemasan2 from '../assets/kemasan2.png'
import kemasan3 from '../assets/kemasan3.png'
import kemasan4 from '../assets/kemasan4.png'

const imageList1 = [kemasan2, kemasan3, kemasan4];
const imageList2 = [kemasan2, kemasan3, kemasan4];

function Onboarding() {
  return (
    <div className="onboarding-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 className="onboarding-title">NUTRIJECT!</h1>
      <p className="onboarding-description">
        KLSDLKFLKSDFNLSFNLSKDFNLSNFSKLNS KLNSKLFNSLKNSDLKSLKNSDKLFNSLFNS!
      </p>
      <button className="get-started-button">Mulai Sekarang</button>

      {/* Add scroll section with Box components */}
      <div className="scroll-section">
        {/* Pass different props for each Box */}
        <Box 
          images={imageList1} 
          title="Title for Box 1" 
          claimText="bli bla blu!" 
          registerText="Siapkan makanan mu!"
        />
        <Box 
          images={imageList2} 
          title="Title for Box 2" 
          claimText="bli bla blu!" 
          registerText="Siapkan makanan mu!"
        />
      </div>
    </div>
  );
}

export default Onboarding;
