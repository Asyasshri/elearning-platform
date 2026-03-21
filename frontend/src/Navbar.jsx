import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, points }) => {
  const navigate = useNavigate();
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : '??';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
      background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg,#6C63FF,#00D4FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 0 20px rgba(108,99,255,0.5)',
        }}>⚡</div>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 18,
          background: 'linear-gradient(135deg,#6C63FF,#00D4FF)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>EduFlow</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {points !== undefined && (
          <div style={{
            background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 20, padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 0 15px rgba(255,215,0,0.2)',
          }}>
            <span style={{ fontSize: 14 }}>⭐</span>
            <span style={{ color: '#FFD700', fontWeight: 700, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
              {points || 0} pts
            </span>
          </div>
        )}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6C63FF,#FF6B9D)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'Inter, sans-serif',
        }}>{initials}</div>
        <span style={{ color: '#A0A0B8', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
          {user?.name?.split(' ')[0]}
        </span>
        <button onClick={logout}
          onMouseEnter={e => e.target.style.background = 'rgba(255,69,96,0.2)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#FF4560', padding: '8px 14px',
            cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif',
            fontWeight: 600, transition: 'all 0.2s',
          }}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;