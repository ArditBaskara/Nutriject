import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Onboarding.css'; // Import CSS for Onboarding styles
import logo from '../assets/Nutrijectlogo.png'; // Import logo
import Box from '../components/Box'; // Import the Box component
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import kemasan2 from '../assets/kemasan2.png';
import kemasan3 from '../assets/kemasan3.png';
import kemasan4 from '../assets/kemasan4.png';
import Cookies from 'js-cookie';
import { decrypt } from '../crypt';
import kemasan1 from '../assets/kemasan1.jpg';
import kemasan5 from '../assets/kemasan5.jpg';
import kemasan6 from '../assets/kemasan6.jpg';
import kemasan7 from '../assets/kemasan7.png';
import ProgressBar from '../components/ProgressBar';

// Images for Box components
const imageList1 = [kemasan1, kemasan5, kemasan6];
const imageList2 = [kemasan2, kemasan3, kemasan4];
const imageList3 = [kemasan7];

const Onboarding = () => {
  const navigate = useNavigate();
  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const goToPersonalize = () => {
    navigate('/personalize');
  };

  const goToData = () => {
    navigate('/data');
  };

  const handleLogoClick = () => {
    Cookies.remove('enc');
    navigate('/');
  };

  // …same imports…

  return (
    <div>
      <Navbar />
      
      <div className="onboarding-container">
        <div className="logo-container">
          <img src={logo} alt="Nutriject Logo" className="logo" onClick={() => {Cookies.remove('enc'); navigate('/');}} />
        </div>

        <h1 className="onboarding-title">NUTRIJECT!</h1>

        {user ? (
          <>
            <p className="onboarding-description">
              Welcome, <strong>{user.name || 'User'}</strong>! Use this app to effortlessly detect nutrition facts from packaged foods and optimize your diet.
            </p>
            <div className="double-button">
              <button onClick={() => navigate('/personalize')}>View Report</button>
              <button onClick={() => navigate('/data')}>Generate Nutri Needs</button>
            </div>
          </>
        ) : (
          <>
            <p className="onboarding-description">
              A web-based AI application that detects nutrition in processed and packaged food — empowering healthier choices for everyone.
            </p>
            <button className="get-started-button" onClick={() => navigate('/auth')}>
              Get Started
            </button>
          </>
        )}

        <div id='service' className="flex justify-center scroll-section">
          <Box images={imageList1} title="NutriScan OCR"      claimText="Scan Nutri Facts Instantly"      registerText="Using advanced OCR technology, simply scan the label, and NutriScan will provide detailed facts like calories, carbs, proteins, and more." navto="/ocr"   />
          <Box images={imageList2} title="FoodSnap Nutrition"      claimText="Snap and See Nutritional Insights"    registerText="This smart feature analyzes the food image and instantly gives you a breakdown of its nutritional content. It’s like having a nutritionist in your pocket."  navto="/photo" />
          <Box images={imageList3} title="Manual NutriLog"        claimText="Track Nutrition the Classic Way"  registerText="Input your meals and ingredients manually to track calories, carbs, fats, and more. Perfect for anyone who prefers a hands-on approach."   navto="/manual"/>
        </div>
      </div>
      <Footer/>
    </div>
  );
};


export default Onboarding;
