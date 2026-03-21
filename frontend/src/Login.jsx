import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

const Login = () => {
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
      body { margin:0; background:#0A0A0F; }
    `;
    document.head.appendChild(s);
    setTimeout(() => setMounted(true), 50);
    return () => document.head.removeChild(s);
  }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) return show('Please fill in all fields', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      show('Welcome back! 🎉', 'success');
      setTimeout(() => navigate(data.user.role === 'instructor' ? '/instructor' : '/student'), 1000);
    } catch (err) {
      show(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally { setLoading(false); }
  };

  const inputStyle = (name) => ({
    background: focused === name ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${focused === name ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: '#fff', padding: '14px 18px', fontSize: 15,
    width: '100%', outline: 'none', transition: 'all 0.3s ease',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
    boxShadow: focused === name ? '0 0 20px rgba(108,99,255,0.2)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#0A0A0F' }}>
      <ToastContainer />

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0D0D1F 0%,#1A0A2E 50%,#0A1A2E 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.2),transparent 70%)', top: '10%', left: '10%', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.15),transparent 70%)', bottom: '15%', right: '10%', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: 48, maxWidth: 420 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🎓</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg,#fff,#A0A0B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Unlock Your<br />Potential
          </h1>
          <p style={{ color: '#A0A0B8', fontSize: 16, lineHeight: 1.7 }}>Join thousands of learners mastering new skills every day.</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 25px rgba(108,99,255,0.5)' }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow</span>
          </div>

          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Welcome Back 👋</h2>
          <p style={{ color: '#A0A0B8', fontSize: 15, marginBottom: 32 }}>Sign in to continue your learning journey</p>

          {/* Role tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {['student', 'instructor'].map(r => (
              <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))} style={{
                flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.3s ease',
                background: form.role === r ? 'linear-gradient(135deg,#6C63FF,#00D4FF)' : 'transparent',
                color: form.role === r ? '#fff' : '#A0A0B8',
                boxShadow: form.role === r ? '0 4px 15px rgba(108,99,255,0.4)' : 'none',
              }}>{r === 'student' ? '👩‍🎓 Student' : '👨‍🏫 Instructor'}</button>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#A0A0B8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>📧 Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email}
              onChange={handle} onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              style={inputStyle('email')} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ color: '#A0A0B8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>🔒 Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password} onChange={handle}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ ...inputStyle('password'), paddingRight: 50 }} />
              <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button onClick={submit} disabled={loading}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(108,99,255,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,99,255,0.4)'; }}
            style={{ width: '100%', background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {loading ? <><Spinner size={20} color="#fff" /> Signing in...</> : '🚀 Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#A0A0B8', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;