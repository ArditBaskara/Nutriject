/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Setting.css'; // Reuse the same CSS for consistency
import logo from '../../assets/Nutrijectlogo.png'; // Reuse the same logo
import Cookies from 'js-cookie';
import { decrypt } from '../../crypt';
import Tutor1 from '../../assets/Tutor1.png';
import Tutor2 from '../../assets/Tutor2.png';
import Tutor3 from '../../assets/Tutor3.png';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Settings = () => {
  const navigate = useNavigate();
  const [apiLink, setApiLink] = useState('');
  const [savedApi, setSavedApi] = useState('');

  const user = Cookies.get('enc') ? decrypt(Cookies.get('enc')) : null;

  useEffect(() => {
    const storedApi = sessionStorage.getItem('apiLink');
    if (storedApi) {
      setApiLink(storedApi);
      setSavedApi(storedApi);
    }
  }, []);

  const handleSaveApi = () => {
    sessionStorage.setItem('apiLink', apiLink);
    setSavedApi(apiLink);
  };

  const handleLogoClick = () => {
    Cookies.remove('enc');
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Settings Section */}
      <div className="onboarding-container">
        {/* How to Settings Section */}
        <div className="how-to-section">
          <h1 className="onboarding-title">Settings</h1>
          <ol className="how-to-list">
            <li className="how-to-step">
              <p>
                Create an account at{' '}
                <a
                  href="https://ngrok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  https://ngrok.com/
                </a>{' '}
                and copy your NGROK Auth Token.{' '}
                <strong>(See example image)</strong>
              </p>
              <div className="image-container">
                <img src={Tutor1} alt="Step 1" className="tutorial-image" />
              </div>
            </li>
            <li className="how-to-step">
              <p>
                Open the AI server on Colab using this link:{' '}
                <a
                  href="https://colab.research.google.com/drive/1n9nqZc5Gwr38vofAJ8vRHBGC11_VBtbT?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Colab Server Link
                </a>
              </p>
            </li>
            <li className="how-to-step">
              <p>
                Paste your NGROK token into the input field provided in the
                Colab notebook.
              </p>
            </li>
            <li className="how-to-step">
              <p>Connect to the Colab runtime (GPU is not required).</p>
            </li>
            <li className="how-to-step">
              <p>
                Press <code>Ctrl + F9</code> or go to{' '}
                <strong>Runtime &gt; Run all</strong> to execute all cells.{' '}
                <strong>(See example image)</strong>
              </p>
              <div className="image-container">
                <img src={Tutor2} alt="Step 2" className="tutorial-image" />
              </div>
            </li>
            <li className="how-to-step">
              <p>
                Wait until an API link appears. Copy the generated API link.{' '}
                <strong>(See example image)</strong>
              </p>
              <div className="image-container">
                <img src={Tutor3} alt="Step 3" className="tutorial-image" />
              </div>
            </li>
            <li className="how-to-step">
              <p>
                Paste the copied API link into the settings input field below on
                this page and click save API.
              </p>
            </li>
            <li className="how-to-step">
              <p>Once saved, you’re ready to start eating.</p>
            </li>
          </ol>
        </div>

        {/* API Settings Card */}
        <div className="settings-card">
          <h3 className="card-title">API Settings</h3>
          <div className="api-input-container">
            <div className="input-container">
              <span className="input-prefix">
                <a
                  href={apiLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="link-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 010 5.656l-1.414 1.414a4 4 0 01-5.656-5.656l1.414-1.414M10.172 13.828a4 4 0 010-5.656l1.414-1.414a4 4 0 015.656 5.656l-1.414 1.414"
                    ></path>
                  </svg>
                </a>
              </span>
              <input
                type="url"
                id="api-link"
                value={apiLink}
                onChange={(e) => setApiLink(e.target.value)}
                placeholder="https://example.com/api"
                className="api-input"
              />
            </div>
            <button className="save-button" onClick={handleSaveApi}>
              Save API
            </button>
          </div>

          {/* Display the saved API link */}
          {savedApi && (
            <div className="saved-api-link">
              <span>Saved API Link: </span>
              <a
                href={savedApi}
                className="external-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {savedApi}
              </a>
              <p className="saved-api-text">
                Links are active and saved in the current session.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Settings;
