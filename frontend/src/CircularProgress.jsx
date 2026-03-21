import React, { useEffect, useState } from 'react';

const CircularProgress = ({ percentage = 0, size = 80, strokeWidth = 6,
  color = '#6C63FF', bg = 'rgba(255,255,255,0.08)' }) => {
  const [pct, setPct] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setPct(Math.min(100, percentage)), 200);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bg} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <span style={{ position: 'absolute', color: '#fff', fontSize: size * 0.2, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
};

export default CircularProgress;