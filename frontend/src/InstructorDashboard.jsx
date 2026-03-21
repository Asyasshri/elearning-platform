import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';

export default function InstructorDashboard() {
  const [user, setUser]     = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toast, setToast]   = useState(null);
  const [form, setForm]     = useState({ title: '', description: '', duration_months: 1, start_date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    api.get('/courses').then(r => { setCourses(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  const createCourse = async () => {
    if (!form.title || !form.start_date) { setToast({ msg: 'Fill in title and start date', type: 'warning' }); return; }
    setCreating(true);
    try {
      await api.post('/courses', form);
      setToast({ msg: '🎉 Course created!', type: 'success' });
      setForm({ title: '', description: '', duration_months: 1, start_date: '' });
      fetchCourses();
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to create course', type: 'error' });
    } finally { setCreating(false); }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#fff', padding: '14px 18px', fontSize: 15,
    width: '100%', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box',
  };

  const myCourses = courses.filter(c => String(c.instructorid) === String(user?.id));

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar user={user} />
      <Sidebar role="instructor" />

      <div style={{ marginLeft: 240, paddingTop: 64 }}>
        <div style={{ padding: '32px 36px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Instructor Dashboard 👨‍🏫</h1>
            <p style={{ color: '#A0A0B8' }}>Manage your courses, upload videos, and create quizzes</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon: '📚', label: 'My Courses', value: myCourses.length, g: 'linear-gradient(135deg,#6C63FF,#00D4FF)', glow: 'rgba(108,99,255,0.3)' },
              { icon: '📹', label: 'Total Videos', value: '—', g: 'linear-gradient(135deg,#FF6B9D,#6C63FF)', glow: 'rgba(255,107,157,0.3)' },
              { icon: '👨‍🎓', label: 'Students', value: '—', g: 'linear-gradient(135deg,#00D4FF,#00E676)', glow: 'rgba(0,212,255,0.3)' },
            ].map((s, i) => (
              <div key={i} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${s.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 28px', transition: 'all 0.35s ease' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, background: s.g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ color: '#A0A0B8', fontSize: 14, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Create Course */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px', marginBottom: 40 }}>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>➕ Create New Course</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Course Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  placeholder="e.g. Introduction to Python" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Start Date</label>
                <input value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  type="date" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                placeholder="Describe what students will learn..." rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 12, display: 'block' }}>Duration</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[1, 2, 3].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, duration_months: d })}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${form.duration_months === d ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`, background: form.duration_months === d ? 'linear-gradient(135deg,rgba(108,99,255,0.3),rgba(0,212,255,0.2))' : 'rgba(255,255,255,0.04)', color: form.duration_months === d ? '#fff' : '#A0A0B8', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.3s ease' }}>
                    {d} Month{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={createCourse} disabled={creating}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(108,99,255,0.5)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(108,99,255,0.3)'; }}
              style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(108,99,255,0.3)', opacity: creating ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              {creating ? <><Spinner size={18} color="#fff" /> Creating...</> : '🚀 Create Course'}
            </button>
          </div>

          {/* My Courses */}
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📚 My Courses</h2>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner size={40} /></div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {myCourses.map(course => (
                <div key={course.courseid}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px', transition: 'all 0.35s ease' }}>
                  <div style={{ fontSize: 11, color: '#6C63FF', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{course.durationmonths} Month Course</div>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16, lineHeight: 1.4 }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate(`/instructor/upload/${course.courseid}`)}
                      onMouseEnter={e => e.target.style.background = 'linear-gradient(135deg,#6C63FF,#00D4FF)'}
                      onMouseLeave={e => e.target.style.background = 'rgba(108,99,255,0.15)'}
                      style={{ flex: 1, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, color: '#6C63FF', padding: '10px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.3s ease' }}>
                      📹 Upload Video
                    </button>
                    <button onClick={() => navigate(`/instructor/quiz/${course.courseid}`)}
                      onMouseEnter={e => e.target.style.background = 'linear-gradient(135deg,#00D4FF,#6C63FF)'}
                      onMouseLeave={e => e.target.style.background = 'rgba(0,212,255,0.15)'}
                      style={{ flex: 1, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 10, color: '#00D4FF', padding: '10px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.3s ease' }}>
                      📝 Create Quiz
                    </button>
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