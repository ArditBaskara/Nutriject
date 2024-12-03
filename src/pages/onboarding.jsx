import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Onboarding.css'; // Import CSS for Onboarding styles
import logo from '../assets/Nutrijectlogo.png'; // Import logo
import Box from '../components/Box'; // Import the Box component
import kemasan2 from '../assets/kemasan2.png';
import kemasan3 from '../assets/kemasan3.png';
import kemasan4 from '../assets/kemasan4.png';
import Cookies from 'js-cookie';
import { decrypt } from '../crypt';

// Images for Box components
const imageList1 = [kemasan2, kemasan3, kemasan4];
const imageList2 = [kemasan2, kemasan3, kemasan4];

const Onboarding = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  // Decrypt user data from cookies
  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;
  console.log(user);

  const handleGetStarted = () => {
    navigate('/auth'); // Redirect to AuthPage
  };

  return (
    <div className="onboarding-container">
      <div className="logo-container">
        <img src={logo} alt="Nutriject Logo" className="logo" />
      </div>
      <h1 className="onboarding-title">NUTRIJECT!</h1>

      {user ? (
        <p className="onboarding-description">
          Selamat datang, <strong>{user.user.email || 'Pengguna'}</strong>! Gunakan aplikasi ini untuk mendeteksi nutrisi pada makanan olahan dan kemasan secara mudah dan akurat.
        </p>
      ) : (
        <>

          <p className="onboarding-description">
            Aplikasi AI Berbasis Web untuk Deteksi Nutrisi Pada Makanan Olahan dan Kemasan Sebagai Solusi Optimasi Gizi Masyarakat.
          </p>
        <button className="get-started-button" onClick={handleGetStarted}>
          Mulai Sekarang
        </button>
        </>
      )}


      {/* Scroll section for Box components */}
      <div className="scroll-section">
        <Box
          images={imageList1}
          title="Deteksi Nutrisi"
          claimText="Mudah dan Akurat!"
          registerText="Mulai Deteksi Sekarang!"
          navto={"/photo"}
        />
        <Box
          images={imageList2}
          title="Optimasi Gizi"
          claimText="Dapatkan Saran Gizi!"
          registerText="Lihat Rekomendasi!"
          navto={"/"}
        />
      </div>
    </div>
  );
};

export default Onboarding;
