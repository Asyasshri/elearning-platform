import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';

export default function Certificates() {
  const [user, setUser]   = useState(null);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get('/certificates/mine')
      .then(r => { setCerts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmerGold {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar user={user} />
      <Sidebar role="student" />

      <div style={{ marginLeft: 240, paddingTop: 64 }}>
        <div style={{ padding: '40px 36px' }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <span style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Certificates</span>
            </h1>
            <p style={{ color: '#A0A0B8' }}>Your verified achievements and course completions</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={48} /></div>
          ) : certs.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 24 }}>🎓</div>
              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>No Certificates Yet</h3>
              <p style={{ color: '#A0A0B8', fontSize: 16, marginBottom: 32 }}>Complete 100% of a course to earn your first certificate</p>
              <button onClick={() => navigate('/student')}
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', border: 'none', borderRadius: 12, color: '#000', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                📚 Browse Courses
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
              {certs.map(cert => (
                <div key={cert.certificateid}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(255,215,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.35s ease' }}>
                  {/* Gold stripe */}
                  <div style={{ height: 6, background: 'linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)', backgroundSize: '200% auto', animation: cert.isclaimed ? 'shimmerGold 3s linear infinite' : 'none' }} />
                  <div style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{ fontSize: 36 }}>🏅</div>
                      <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: cert.isclaimed ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.08)', color: cert.isclaimed ? '#FFD700' : '#A0A0B8', border: `1px solid ${cert.isclaimed ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                        {cert.isclaimed ? '✨ Claimed' : '⏳ Pending'}
                      </div>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{cert.coursetitle}</h3>
                    <p style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 20 }}>👨‍🏫 {cert.instructorname}</p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                      <div style={{ color: '#505070', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Certificate ID</div>
                      <div style={{ color: '#A0A0B8', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>{cert.uniquecode}</div>
                    </div>
                    <div style={{ color: '#505070', fontSize: 12 }}>📅 Issued: {new Date(cert.issuedate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}