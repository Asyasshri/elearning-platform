import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
      @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.05)} }
      @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,35px) scale(0.95)} }
      @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,25px) scale(1.08)} }
      @keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      .hero-btn:hover { transform:translateY(-3px)!important; box-shadow:0 12px 40px rgba(108,99,255,0.6)!important; }
      .feature-card:hover { transform:translateY(-8px)!important; border-color:rgba(108,99,255,0.4)!important; }
      .stat-card:hover { transform:translateY(-5px)!important; }
      html { scroll-behavior:smooth; }
      body { margin:0; background:#0A0A0F; }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    sectionsRef.current.forEach(s => s && observer.observe(s));
    return () => { document.head.removeChild(style); observer.disconnect(); };
  }, []);

  const addRef = i => el => { sectionsRef.current[i] = el; };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', fontFamily: 'Inter, sans-serif', color: '#fff', overflow: 'hidden' }}>

      {/* Floating orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.18) 0%,transparent 70%)', top: '-200px', left: '-200px', animation: 'float1 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.15) 0%,transparent 70%)', bottom: '-150px', right: '-100px', animation: 'float2 15s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,107,157,0.12) 0%,transparent 70%)', top: '50%', left: '60%', animation: 'float3 10s ease-in-out infinite' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 72, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 0 20px rgba(108,99,255,0.5)' }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', padding: '10px 22px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 22px', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(108,99,255,0.4)' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 860, animation: 'fadeInUp 0.8s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 32, fontSize: 13, color: '#A0A0B8' }}>
            <span style={{ animation: 'pulse 2s infinite' }}>🚀</span> The future of online learning is here
          </div>
          <h1 style={{ fontSize: 'clamp(48px,8vw,88px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
            Learn Without{' '}
            <span style={{ background: 'linear-gradient(135deg,#6C63FF 0%,#00D4FF 50%,#FF6B9D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 200%', animation: 'shimmer 4s ease infinite' }}>
              Limits
            </span>
          </h1>
          <p style={{ fontSize: 20, color: '#A0A0B8', lineHeight: 1.7, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
            Master new skills with structured courses, interactive quizzes, and verified certificates.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="hero-btn" onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 14, color: '#fff', padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 30px rgba(108,99,255,0.4)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
              🎓 Start Learning Free
            </button>
            <button className="hero-btn" onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid rgba(108,99,255,0.5)', borderRadius: 14, color: '#6C63FF', padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
              👨‍🏫 Teach on EduFlow
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={addRef(0)} style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s ease' }}>
        <h2 style={{ textAlign: 'center', fontSize: 42, fontWeight: 800, marginBottom: 16 }}>
          Why Choose <span style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow?</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#A0A0B8', fontSize: 16, marginBottom: 60 }}>Everything you need to succeed in your learning journey</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          {[
            { icon: '🎯', title: 'Structured Learning Paths', desc: 'Follow carefully crafted course curricula organized by weeks with videos, quizzes, and assessments at every stage.', gradient: 'linear-gradient(135deg,#6C63FF,#00D4FF)' },
            { icon: '🔒', title: 'Engagement Enforced', desc: 'Our unique system ensures you actually watch content before progressing — no shortcuts, only genuine learning.', gradient: 'linear-gradient(135deg,#FF6B9D,#6C63FF)' },
            { icon: '🏆', title: 'Verified Certificates', desc: 'Earn certificates only after 100% course completion. Your achievement means something real and verifiable.', gradient: 'linear-gradient(135deg,#FFD700,#FF8C00)' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '36px 32px', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: f.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20, boxShadow: '0 8px 24px rgba(108,99,255,0.3)' }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: '#A0A0B8', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section ref={addRef(1)} style={{ padding: '80px 48px', opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s ease 0.2s', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
          {[
            { num: '10,000+', label: 'Active Learners', icon: '👩‍🎓', glow: 'rgba(108,99,255,0.4)' },
            { num: '500+', label: 'Expert Courses', icon: '📚', glow: 'rgba(0,212,255,0.4)' },
            { num: '98%', label: 'Satisfaction Rate', icon: '⭐', glow: 'rgba(255,215,0,0.4)' },
            { num: '50K+', label: 'Certificates Issued', icon: '🏆', glow: 'rgba(255,107,157,0.4)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', boxShadow: `0 0 30px ${s.glow}`, transition: 'all 0.3s ease' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#fff,#A0A0B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>{s.num}</div>
              <div style={{ color: '#A0A0B8', fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section ref={addRef(2)} style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto', opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s ease 0.3s', position: 'relative', zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 48 }}>What our students say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {[
            { name: 'Priya Sharma', role: 'Software Engineer', text: 'EduFlow changed my career. The structured learning approach made me actually retain everything I studied.', emoji: '👩‍💻' },
            { name: 'Arjun Mehta', role: 'Data Analyst', text: 'The certificate I earned here was recognized by my employer. Genuinely worth every second spent.', emoji: '👨‍💼' },
            { name: 'Sara Nair', role: 'Product Manager', text: 'The quizzes and progress tracking kept me accountable. Best online learning experience I have had!', emoji: '👩‍🎯' },
          ].map(t => (
            <div key={t.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ color: '#C0C0D0', lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#FF6B9D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: '#505070', fontSize: 12 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduFlow</span>
        </div>
        <p style={{ color: '#505070', fontSize: 13 }}>© 2026 EduFlow. Empowering learners, one course at a time.</p>
      </footer>
    </div>
  );
};

export default Landing;