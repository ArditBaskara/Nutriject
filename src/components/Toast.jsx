import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3500, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-100 text-green-800';

  return (
    <div className={`fixed top-30 right-6 z-50 max-w-sm w-full ${bg} border rounded-lg shadow p-3`} role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm">{message}</div>
        <button onClick={() => onClose && onClose()} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
      </div>
    </div>
  );
};

export default Toast;
