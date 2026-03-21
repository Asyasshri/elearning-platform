import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CircularProgress from '../../components/CircularProgress';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      body { margin:0; background:#0A0A0F; }
    `;
    document.head.appendChild(s);
    fetchData();
    return () => document.head.removeChild(s);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollRes, allRes] = await Promise.all([
        api.get('/courses/enrolled'),
        api.get('/courses'),
      ]);
      const enrolledIds = (enrollRes.data || []).map(e => e.courseid);
      setEnrolled(enrollRes.data || []);
      setAvailable((allRes.data || []).filter(c => !enrolledIds.includes(c.courseid)));
    } catch (err) { show('Failed to load courses', 'error'); }
    finally { setLoading(false); }
  };

  const enroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      show('Enrolled successfully! 🎉', 'success');
      fetchData();
    } catch (err) { show(err.response?.data?.message || 'Enrollment failed', 'error'); }
    finally { setEnrollingId(null); }
  };

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good Morning';
    if (h < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const totalPoints = user?.total_points || 0;
  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}>
      <ToastContainer />
      <Navbar user={user} points={totalPoints} />
      <Sidebar role="student" />

      <main style={{ marginLeft: 240, padding: '80px 32px 40px 272px' }}>
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.6s ease' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {greeting()}, <span style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name?.split(' ')[0]}!</span>
          </h1>
          <p style={{ color: '#A0A0B8', fontSize: 15 }}>
            {days[new Date().getDay()]}, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — Let's keep learning! 💪
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 36 }}>
          {[
            { label: 'Enrolled Courses', value: enrolled.length, icon: '📚', gradient: 'linear-gradient(135deg,#6C63FF,#00D4FF)', glow: 'rgba(108,99,255,0.3)' },
            { label: 'Total Points', value: totalPoints, icon: '⭐', gradient: 'linear-gradient(135deg,#FFD700,#FF8C00)', glow: 'rgba(255,215,0,0.3)' },
            { label: 'Completed', value: enrolled.filter(e => e.progress >= 100).length, icon: '✅', gradient: 'linear-gradient(135deg,#00E676,#00D4FF)', glow: 'rgba(0,230,118,0.3)' },
            { label: 'Available', value: available.length, icon: '🎯', gradient: 'linear-gradient(135deg,#FF6B9D,#6C63FF)', glow: 'rgba(255,107,157,0.3)' },
          ].map((st, i) => (
            <div key={st.label} style={{ ...card, padding: '24px 20px', animation: `fadeInUp 0.6s ease ${i*0.1}s both`, boxShadow: `0 0 30px ${st.glow}` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${st.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 30px ${st.glow}`; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: st.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{st.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{st.value}</div>
              <div style={{ color: '#A0A0B8', fontSize: 13 }}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Enrolled courses */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>📖 My Enrolled Courses</h2>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
          ) : enrolled.length === 0 ? (
            <div style={{ ...card, padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
              <p style={{ color: '#A0A0B8', fontSize: 16 }}>You haven't enrolled in any courses yet. Explore available courses below!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {enrolled.map(course => (
                <div key={course.courseid} style={{ ...card, padding: 24, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(108,99,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,255,0.1))', borderRadius: 8, padding: '4px 10px', display: 'inline-block', fontSize: 11, color: '#00D4FF', fontWeight: 600, marginBottom: 8 }}>
                        {course.duration_months} Month{course.duration_months > 1 ? 's' : ''}
                      </div>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>{course.title}</h3>
                      <p style={{ color: '#505070', fontSize: 13 }}>👨‍🏫 {course.instructor_name || 'Instructor'}</p>
                    </div>
                    <CircularProgress percentage={course.progress || 0} size={60} strokeWidth={5} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: course.progress >= 100 ? 'rgba(0,230,118,0.15)' : 'rgba(108,99,255,0.15)', color: course.progress >= 100 ? '#00E676' : '#6C63FF', border: `1px solid ${course.progress >= 100 ? 'rgba(0,230,118,0.3)' : 'rgba(108,99,255,0.3)'}` }}>
                      {course.progress >= 100 ? '✅ Completed' : '▶ In Progress'}
                    </span>
                    <button onClick={() => navigate(`/student/course/${course.courseid}`)}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 10, color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {course.progress >= 100 ? '🏆 Review' : '▶ Continue'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available courses */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>🌐 Available Courses</h2>
          {available.length === 0 && !loading ? (
            <div style={{ ...card, padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#A0A0B8' }}>🎉 You're enrolled in all available courses!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {available.map(course => (
                <div key={course.courseid} style={{ ...card, padding: 24 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,rgba(255,107,157,0.3),rgba(108,99,255,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>📘</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{course.title}</h3>
                  <p style={{ color: '#505070', fontSize: 13, marginBottom: 6 }}>👨‍🏫 {course.instructor_name || 'Instructor'}</p>
                  <p style={{ color: '#A0A0B8', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{course.description?.slice(0,80)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#A0A0B8', fontSize: 12 }}>⏱ {course.duration_months} month{course.duration_months > 1 ? 's' : ''}</span>
                    <button onClick={() => enroll(course.courseid)} disabled={enrollingId === course.courseid}
                      onMouseEnter={e => { e.target.style.background = 'linear-gradient(135deg,#6C63FF,#00D4FF)'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#6C63FF'; }}
                      style={{ background: 'transparent', border: '1px solid rgba(108,99,255,0.6)', borderRadius: 10, color: '#6C63FF', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {enrollingId === course.courseid ? <Spinner size={14} /> : '+ Enroll'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;