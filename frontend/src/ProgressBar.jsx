import React, { useEffect, useState } from 'react';

const ProgressBar = ({ value = 0, max = 100, label = true, height = 10,
  gradient = 'linear-gradient(90deg,#6C63FF,#00D4FF)', style = {} }) => {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.round((value / max) * 100));
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ width: '100%', ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#A0A0B8', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>Progress</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{pct}%</span>
        </div>
      )}
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`, background: gradient,
          borderRadius: 100, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(108,99,255,0.5)',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;