import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const studentLinks = [
    { icon: '🏠', label: 'Dashboard', path: '/student' },
    { icon: '📚', label: 'My Courses', path: '/student' },
    { icon: '🏆', label: 'Certificates', path: '/student/certificates' },
  ];

  const instructorLinks = [
    { icon: '📊', label: 'Dashboard', path: '/instructor' },
    { icon: '🎬', label: 'Upload Video', path: '/instructor' },
    { icon: '📝', label: 'Create Quiz', path: '/instructor' },
  ];

  const links = role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 64, bottom: 0, width: 240,
      background: 'rgba(10,10,20,0.9)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px', overflowY: 'auto', zIndex: 90,
    }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{
          color: '#505070', fontSize: 11, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif', paddingLeft: 12,
        }}>
          {role === 'instructor' ? 'Instructor' : 'Student'} Menu
        </span>
      </div>
      {links.map(link => {
        const active = location.pathname === link.path;
        return (
          <button key={link.path + link.label}
            onClick={() => navigate(link.path)}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
              background: active
                ? 'linear-gradient(135deg,rgba(108,99,255,0.25),rgba(0,212,255,0.1))'
                : 'transparent',
              color: active ? '#fff' : '#A0A0B8',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              fontFamily: 'Inter, sans-serif', fontSize: 14,
              fontWeight: active ? 600 : 400,
              transition: 'all 0.2s', marginBottom: 4,
              borderLeft: active ? '3px solid #6C63FF' : '3px solid transparent',
            }}>
            <span style={{ fontSize: 18 }}>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;