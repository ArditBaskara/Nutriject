/* eslint-disable */

// components/ProgressBar.jsx
import './ProgressBar.css';
import {
  FaBreadSlice,
  FaDrumstickBite,
  FaAppleAlt,
  FaTint,
  FaCheese,
  FaUtensilSpoon,
} from 'react-icons/fa';

const icons = {
  Karbohidrat: <FaBreadSlice />,
  Protein: <FaDrumstickBite />,
  Gula: <FaAppleAlt />,
  Garam: <FaUtensilSpoon />,
  Lemak: <FaCheese />,
};

export default function ProgressBar({ label, min, max, val }) {
  const percentage = Math.min(100, Math.max(0, (val / max) * 100));

  // ✅ Cek apakah nilai sehat
  const inRange = val >= min && val <= max;
  const barColor = inRange ? '#2ecc71' : '#e74c3c'; // Hijau atau merah

  return (
    <div className="nutri-bar">
      <div className="nutri-label">
        {icons[label] || <FaAppleAlt />} <span>{label}</span>
      </div>

      <div className="nutri-range">
        {/* Penanda batas min & max */}
        <div
          className="nutri-limit-line"
          style={{ left: `${(min / max) * 100}%` }}
        ></div>
        <div
          className="nutri-limit-line"
          style={{ left: `${(max / max) * 100}%` }}
        ></div>

        <div
          className="nutri-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        ></div>
      </div>

      <div className="nutri-values">
        <span className="nutri-value-left">Min: {min.toFixed(2)}g</span>
        <span className="nutri-value-center">{val.toFixed(2)}g</span>
        <span className="nutri-value-right">Max: {max.toFixed(2)}g</span>
      </div>
    </div>
  );
}
