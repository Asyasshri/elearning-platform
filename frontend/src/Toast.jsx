import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const t1 = setTimeout(() => setLeaving(true), 2700);
    const t2 = setTimeout(() => { setVisible(false); onClose && onClose(); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  const colors = {
    success: { border: '#00E676', icon: '✅', bg: 'rgba(0,230,118,0.1)' },
    error:   { border: '#FF4560', icon: '❌', bg: 'rgba(255,69,96,0.1)' },
    warning: { border: '#FFB300', icon: '⚠️', bg: 'rgba(255,179,0,0.1)' },
    info:    { border: '#00D4FF', icon: 'ℹ️', bg: 'rgba(0,212,255,0.1)' },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      transform: visible && !leaving ? 'translateX(0)' : 'translateX(120%)',
      opacity: leaving ? 0 : 1,
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      background: 'rgba(20,20,35,0.95)',
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: 14, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      minWidth: 280, maxWidth: 380,
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${c.border}33`,
    }}>
      <span style={{ fontSize: 20 }}>{c.icon}</span>
      <span style={{ color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
  };
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, padding: 24 }}>
      {toasts.map((t, i) => (
        <div key={t.id} style={{ transform: `translateY(${i * 4}px)` }}>
          <Toast message={t.message} type={t.type} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
  return { show, ToastContainer };
};

export default Toast;