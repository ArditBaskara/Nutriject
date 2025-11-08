import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import logo from '../../assets/Nutrijectlogo.png';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import kemasan1 from '../../assets/kemasan1.jpg';
import kemasan2 from '../../assets/kemasan2.png';
import kemasan3 from '../../assets/kemasan3.png';
import kemasan4 from '../../assets/kemasan4.png';
import kemasan5 from '../../assets/kemasan5.jpg';
import kemasan6 from '../../assets/kemasan6.jpg';
import kemasan7 from '../../assets/kemasan7.png';
import Cookies from 'js-cookie';
import { decrypt } from '../../crypt';
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
      title: 'NutriScan OCR',
      subtitle: 'Scan Nutri Facts Instantly',
      description:
        'Using advanced OCR technology, simply scan the label, and NutriScan will provide detailed facts like calories, carbs, proteins, and more.',
      images: imageList1,
      navto: '/ocr',
      color: 'from-nutriOrange to-orange-400'
    },
    {
      icon: <FaAppleAlt className="text-5xl" />,
      title: 'FoodSnap Nutrition',
      subtitle: 'Snap and See Nutritional Insights',
      description:
        "This smart feature analyzes the food image and instantly gives you a breakdown of its nutritional content. It's like having a nutritionist in your pocket.",
      images: imageList2,
      navto: '/photo',
      color: 'from-nutriGreen to-green-400'
    },
    {
      icon: <FaChartLine className="text-5xl" />,
      title: 'Manual NutriLog',
      subtitle: 'Track Nutrition the Classic Way',
      description:
        'Input your meals and ingredients manually to track calories, carbs, fats, and more. Perfect for anyone who prefers a hands-on approach.',
      images: imageList3,
      navto: '/manual',
      color: 'from-blue-500 to-blue-400'
    }
  ];

  const healthTips = [
    { icon: <FaLeaf />, title: 'Balanced Diet', text: 'Mix vegetables, proteins, and carbs for optimal health' },
    { icon: <FaHeart />, title: 'Heart Health', text: 'Track sodium and saturated fats to protect your heart' },
    { icon: <FaSmile />, title: 'Feel Great', text: 'Proper nutrition boosts energy and mood' }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Hero background crossfade (images are in public/hero: 1.jpg,2.jpg,3.jpg) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 hero-slide s1" style={{ backgroundImage: "url('/hero/1.jpg')" }} />
          <div className="absolute inset-0 hero-slide s2" style={{ backgroundImage: "url('/hero/2.jpg')" }} />
          <div className="absolute inset-0 hero-slide s3" style={{ backgroundImage: "url('/hero/3.jpg')" }} />
          {/* subtle wash to keep text readable */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-nutriOrange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-nutriGreen/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 inline-block hero-logo">
            <img
              src={"./icon-1.png"}
              alt="Nutriject Logo"
              className="w-32 h-32 mx-auto drop-shadow-2xl hover:scale-110 transition-transform duration-1000 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-nutriOrange bg-clip-text text-transparent animate-gradient hero-title">
            NUTRIJECT
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 hero-subtitle">Your Smart Nutrition Companion</p>

          {user ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl mx-auto mb-8">
              <p className="text-xl text-gray-700 mb-6">
                Welcome back, <span className="font-bold text-nutriGreen">{user.name || 'User'}</span>!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/personalize')}
                  className="px-8 py-4 bg-gradient-to-r from-nutriGreen to-green-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  View Report
                </button>
                <button
                  onClick={() => navigate('/data')}
                  className="px-8 py-4 bg-gradient-to-r from-nutriOrange to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Generate Nutri Needs
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                A web-based AI application that detects nutrition in processed and packaged food —{' '}
                <span className="font-semibold text-nutriGreen">empowering healthier choices</span> for everyone.
              </p>

              <button
                onClick={() => navigate('/auth')}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-nutriOrange to-nutriGreen text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <span className="relative z-10 text-2xl">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-nutriGreen to-nutriOrange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <p className="text-sm text-gray-500">No credit card required • Start tracking instantly</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-nutriGreen/10 to-nutriOrange/10">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-700 italic">"Let food be thy medicine and medicine be thy food"</blockquote>
          <p className="mt-4 text-lg text-gray-600">— Hippocrates</p>
        </div>
      </section>

      <section id="service" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Choose your preferred way to track nutrition</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} text-white`}>
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{features[activeFeature].title}</h3>
                <p className="text-xl text-nutriOrange font-semibold">{features[activeFeature].subtitle}</p>
                <p className="text-gray-600 leading-relaxed text-lg">{features[activeFeature].description}</p>
                <button
                  onClick={() => navigate(features[activeFeature].navto)}
                  className={`px-8 py-4 bg-gradient-to-r ${features[activeFeature].color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  Try it now →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {features[activeFeature].images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Feature ${idx + 1}`} className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full h-48 object-cover" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(feature.navto)}
              >
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Members showcase - healthy food theme */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our Healthy Members</h2>
            <p className="text-gray-600">Real people, real results — small changes make big differences.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Member 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center gap-4">
                <img src={kemasan5} alt="Member avatar" className="w-20 h-20 rounded-full object-cover shadow" />
                <div>
                  <div className="font-semibold text-lg text-gray-800">Ayu Putri</div>
                  <div className="text-sm text-gray-500">"I swap snacks for fruit — I feel lighter!"</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">#Salad</span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">#Smoothie</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">#Nuts</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Calories/day</span><span className="font-semibold">1,750</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '58%' }} role="progressbar" aria-valuenow={58} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
            </div>

            {/* Member 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center gap-4">
                <img src={kemasan2} alt="Member avatar" className="w-20 h-20 rounded-full object-cover shadow" />
                <div>
                  <div className="font-semibold text-lg text-gray-800">Rizal H.</div>
                  <div className="text-sm text-gray-500">"Portion control + veggies = energy all day."</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">#Protein</span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">#WholeGrains</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Calories/day</span><span className="font-semibold">2,050</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '72%' }} role="progressbar" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
            </div>

            {/* Member 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center gap-4">
                <img src={kemasan7} alt="Member avatar" className="w-20 h-20 rounded-full object-cover shadow" />
                <div>
                  <div className="font-semibold text-lg text-gray-800">Siti Rahma</div>
                  <div className="text-sm text-gray-500">"I meal-prep with colorful veggies — it's easy!"</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">#MealPrep</span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">#Veggies</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Calories/day</span><span className="font-semibold">1,620</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '51%' }} role="progressbar" aria-valuenow={51} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Track Your Nutrition?</h2>
            <p className="text-xl text-gray-600">Small changes lead to big health benefits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {healthTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-5xl text-nutriGreen mb-4">{tip.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center bg-gradient-to-r from-nutriOrange to-nutriGreen rounded-3xl p-12 md:p-16 shadow-2xl text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Health Journey?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of users making smarter food choices every day</p>
            <button onClick={() => navigate('/auth')} className="px-12 py-5 bg-white text-nutriOrange text-xl font-bold rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl">
              Sign Up Now — It's Free! 🚀
            </button>
            <p className="mt-6 text-sm opacity-75">Already a member? <button onClick={() => navigate('/auth')} className="underline font-semibold">Sign In</button></p>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        /* Hero crossfade slides */
        .hero-slide { background-size: cover; background-position: center; opacity: 0; animation: hero-fade 12s linear infinite; will-change: opacity; }
        .hero-slide.s1 { animation-delay: 0s; }
        .hero-slide.s2 { animation-delay: 4s; }
        .hero-slide.s3 { animation-delay: 8s; }
        @keyframes hero-fade {
          0% { opacity: 0; }
          6.66% { opacity: 1; }
          30% { opacity: 1; }
          36.66% { opacity: 0; }
          100% { opacity: 0; }
        }

        /* Gentler bounce for logo (will run after entrance) */
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(2); }
          50% { transform: translateY(-8px); }
        }

        /* Hero entrance animations (staggered, smooth). For the logo we run entrance first, then start the looping gentle-bounce */
        .hero-logo, .hero-title, .hero-subtitle { opacity: 0; transform: translateY(10px); }
        .hero-logo { animation: hero-entrance 0.9s cubic-bezier(.22,.9,.32,1) forwards 0.2s, gentle-bounce 2.8s ease-in-out infinite 1.4s; }
        .hero-title { animation: hero-entrance 0.9s cubic-bezier(.22,.9,.32,1) forwards; animation-delay: 0.6s; }
        .hero-subtitle { animation: hero-entrance 0.9s cubic-bezier(.22,.9,.32,1) forwards; animation-delay: 0.95s; }
        @keyframes hero-entrance {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-slide, .gentle-bounce, .hero-logo, .hero-title, .hero-subtitle { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;