import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decrypt } from '../crypt';

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;

  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 min-h-[90px] left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-lg shadow-md py-5`}>
        <div className="max-w-7xl mx-auto my-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none" onClick={() => navigate('/')}>
              <img src="/icon-1.png" alt="Nutriject" className={`transition-all duration-300 object-contain rounded-xl shadow-sm h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 group-hover:scale-110 group-hover:shadow-md`} />
              <div className="flex flex-col leading-none">
                <h1 className={`font-extrabold tracking-tight text-orange-400 transition-all duration-300 justify-center items-center align-middle my-auto text-2xl sm:text-3xl`}>NUTRIJECT</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <NavLink to="/" className={({isActive}) => `text-sm lg:text-base font-semibold transition-all duration-200 hover:text-orange-500 ${isActive ? 'text-orange-500' : 'text-gray-700'}`}>Home</NavLink>
              <NavLink to="/#features" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-orange-500 transition-all duration-200">Features</NavLink>
              <NavLink to="/#benefits" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-orange-500 transition-all duration-200">Benefits</NavLink>
              <NavLink to="/setting" className={({isActive}) => `text-sm lg:text-base font-semibold transition-all duration-200 hover:text-orange-500 ${isActive ? 'text-orange-500' : 'text-gray-700'}`}>Settings</NavLink>
              {user ? (
                <NavLink to="/personalize" className="px-5 lg:px-6 py-2.5 bg-orange-500 text-white text-sm lg:text-base font-bold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">Dashboard</NavLink>
              ) : (
                <NavLink to="/auth" className="px-5 lg:px-6 py-2.5 bg-orange-500 text-white text-sm lg:text-base font-bold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">Get Started</NavLink>
              )}
            </div>

            <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown (full-width, scrollable) */}
      <div className={`md:hidden fixed left-0 w-full z-50 transition-all bg-white duration-300 ${mobileMenuOpen ? 'top-[90px] opacity-100 pointer-events-auto' : '-top-96 opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col gap-2 p-4 max-h-[60vh] overflow-y-auto">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition ${isActive ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-gray-50'}`}>Home</NavLink>
          <button onClick={() => { scrollToSection('features'); }} className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50">Features</button>
          <button onClick={() => { scrollToSection('benefits'); }} className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50">Benefits</button>
          <NavLink to="/setting" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition ${isActive ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-gray-50'}`}>Settings</NavLink>

          <div className="mt-4 pt-4 border-t border-gray-100">
            {user ? (
              <NavLink to="/personalize" onClick={() => setMobileMenuOpen(false)} className="w-full block text-center px-4 py-3 bg-orange-500 text-white rounded-lg font-bold shadow">Dashboard</NavLink>
            ) : (
              <NavLink to="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full block text-center px-4 py-3 bg-orange-500 text-white rounded-lg font-bold shadow">Get Started</NavLink>
            )}
          </div>

          {user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              <div className="font-semibold">Logged in as</div>
              <div className="truncate">{user.email || user.name || 'User'}</div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
