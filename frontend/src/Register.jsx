import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

const Register = () => {
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', bio: '' });
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

  const strength = (pwd) => {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^a-zA-Z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColor = ['', '#FF4560', '#FF8C00', '#FFB300', '#00D4FF', '#00E676'];
  const s = strength(form.password);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) return show('Please fill in all required fields', 'error');
    if (form.password.length < 6) return show('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      show('Account created successfully! 🎉', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      show(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  const inputStyle = (name) => ({
    background: focused === name ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${focused === name ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: '#fff', padding: '14px 18px', fontSize: 15,
    width: '100%', outline: 'none', transition: 'all 0.3s ease',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#0A0A0F' }}>
      <ToastContainer />

      {/* Left */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0D0D1F,#1A0A2E,#0D1A0D)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,230,118,0.15),transparent 70%)', top: '5%', right: '5%', animation: 'float 9s ease-in-out infinite' }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: 48, maxWidth: 400 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>✨</div>
          <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.15, marginBottom: 16, background: 'linear-gradient(135deg,#fff,#A0A0B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Start Your<br />Learning Journey
          </h1>
          <p style={{ color: '#A0A0B8', fontSize: 15, lineHeight: 1.7 }}>Join EduFlow today and gain access to hundreds of courses and verified certificates.</p>
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['🎯 Structured Courses', '📊 Progress Tracking', '🧠 Weekly Quizzes', '🏆 Certificates'].map(f => (
              <div key={f} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px', fontSize: 13, color: '#A0A0B8', textAlign: 'left' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ width: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Create Account 🚀</h2>
          <p style={{ color: '#A0A0B8', fontSize: 14, marginBottom: 24 }}>Fill in the details to get started</p>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {['student', 'instructor'].map(r => (
              <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))} style={{
                flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.3s ease',
                background: form.role === r ? 'linear-gradient(135deg,#6C63FF,#00D4FF)' : 'transparent',
                color: form.role === r ? '#fff' : '#A0A0B8',
              }}>{r === 'student' ? '👩‍🎓 Student' : '👨‍🏫 Instructor'}</button>
            ))}
          </div>

          {['name', 'email', 'password'].map(field => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={{ color: '#A0A0B8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                {field === 'name' ? '👤 Full Name' : field === 'email' ? '📧 Email Address' : '🔒 Password'}
              </label>
              <input name={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                placeholder={field === 'name' ? 'Your full name' : field === 'email' ? 'you@example.com' : 'Create a strong password'}
                value={form[field]} onChange={handle}
                onFocus={() => setFocused(field)} onBlur={() => setFocused('')}
                style={inputStyle(field)} />
              {field === 'password' && form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ height: 4, flex: 1, borderRadius: 100, background: i <= s ? strengthColor[s] : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor[s] }}>{strengthLabel[s]}</span>
                </div>
              )}
            </div>
          ))}

          <div style={{ overflow: 'hidden', maxHeight: form.role === 'instructor' ? '150px' : '0', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)', marginBottom: form.role === 'instructor' ? 14 : 0 }}>
            <label style={{ color: '#A0A0B8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>📝 Bio (optional)</label>
            <textarea name="bio" placeholder="Tell students about your expertise..." value={form.bio}
              onChange={handle} onFocus={() => setFocused('bio')} onBlur={() => setFocused('')}
              rows={3} style={{ ...inputStyle('bio'), resize: 'none' }} />
          </div>

          <button onClick={submit} disabled={loading}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            style={{ width: '100%', background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 }}>
            {loading ? <><Spinner size={20} color="#fff" /> Creating account...</> : '✨ Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#A0A0B8', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;