import React from 'react';

const Spinner = ({ size = 24, color = '#6C63FF' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" fill="none"
        stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <path d="M12 2 a10 10 0 0 1 10 10" fill="none"
        stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
);

export default Spinner;