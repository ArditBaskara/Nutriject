// src/components/Button.jsx
import React from 'react';
import './Button.css'; // Import the CSS file for button styles

function Button({ onClick, children }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
