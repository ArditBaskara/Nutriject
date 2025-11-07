import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import logo from '../../assets/Nutrijectlogo.png';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import kemasan2 from '../../assets/kemasan2.png';
import kemasan3 from '../../assets/kemasan3.png';
import kemasan4 from '../../assets/kemasan4.png';
import Cookies from 'js-cookie';
import { decrypt } from '../../crypt';
import kemasan1 from '../../assets/kemasan1.jpg';
import kemasan5 from '../../assets/kemasan5.jpg';
import kemasan6 from '../../assets/kemasan6.jpg';
import kemasan7 from '../../assets/kemasan7.png';
import { FaAppleAlt, FaCamera, FaChartLine, FaHeart, FaLeaf, FaSmile } from 'react-icons/fa';


const imageList1 = [kemasan1, kemasan5, kemasan6];
const imageList2 = [kemasan2, kemasan3, kemasan4];
const imageList3 = [kemasan7];

const Onboarding = () => {
  const navigate = useNavigate();
  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaCamera className="text-5xl" />,
      title: "NutriScan OCR",
      subtitle: "Scan Nutri Facts Instantly",
      description: "Using advanced OCR technology, simply scan the label, and NutriScan will provide detailed facts like calories, carbs, proteins, and more.",
      images: imageList1,
      navto: "/ocr",
      color: "from-nutriOrange to-orange-400"
    },
    {
      icon: <FaAppleAlt className="text-5xl" />,
      title: "FoodSnap Nutrition",
      subtitle: "Snap and See Nutritional Insights",
      description: "This smart feature analyzes the food image and instantly gives you a breakdown of its nutritional content. It's like having a nutritionist in your pocket.",
      images: imageList2,
      navto: "/photo",
      color: "from-nutriGreen to-green-400"
    },
    {
      icon: <FaChartLine className="text-5xl" />,
      title: "Manual NutriLog",
      subtitle: "Track Nutrition the Classic Way",
      description: "Input your meals and ingredients manually to track calories, carbs, fats, and more. Perfect for anyone who prefers a hands-on approach.",
      images: imageList3,
      navto: "/manual",
      color: "from-blue-500 to-blue-400"
    }
  ];

  const healthTips = [
    { icon: <FaLeaf />, title: "Balanced Diet", text: "Mix vegetables, proteins, and carbs for optimal health" },
    { icon: <FaHeart />, title: "Heart Health", text: "Track sodium and saturated fats to protect your heart" },
    { icon: <FaSmile />, title: "Feel Great", text: "Proper nutrition boosts energy and mood" }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-nutriOrange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-nutriGreen/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo with animation */}
          <div className="mb-8 inline-block animate-bounce">
            <img 
              src={logo} 
              alt="Nutriject Logo" 
              className="w-32 h-32 mx-auto drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Hero Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-nutriOrange via-nutriGreen to-nutriOrange bg-clip-text text-transparent animate-gradient">
            NUTRIJECT
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Your Smart Nutrition Companion
          </p>

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
