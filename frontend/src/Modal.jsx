import React, { useEffect, useState } from 'react';

const Modal = ({ open, onClose, children, title }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [open]);
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease',
    }} onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div style={{
        background: 'rgba(20,20,40,0.98)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 24, padding: '32px 36px',
        maxWidth: 520, width: '100%', position: 'relative',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {title && <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>{title}</h2>}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
          width: 32, height: 32, color: '#fff', cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;