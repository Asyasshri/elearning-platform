import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

const banners = ['course-banner-1','course-banner-2','course-banner-3','course-banner-4','course-banner-5','course-banner-6'];
const emojis = ['📚','💡','🔬','🎯','🚀','⚡'];

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [tab, setTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/courses/my-courses')]).then(([all, mine]) => {
      setCourses(all.data);
      setMyCourses(mine.data);
      setLoading(false);
    });
  }, []);

  const enroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setMsg('✅ Enrolled successfully!');
      const mine = await api.get('/courses/my-courses');
      setMyCourses(mine.data);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Enrollment failed'));
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const isEnrolled = (courseId) => myCourses.some(c => c.courseid === courseId);

  return (
    <div className="app-layout">
      <Sidebar role="student" />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Welcome back, {name} 👋</h1>
          <p className="page-subtitle">Continue your learning journey</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{myCourses.length}</div><div className="stat-label">Enrolled Courses</div></div>
          <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{myCourses.filter(c => c.status === 'Completed').length}</div><div className="stat-label">Completed</div></div>
          <div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-value">{courses.length}</div><div className="stat-label">Available Courses</div></div>
          <div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-value">{myCourses.length * 50}</div><div className="stat-label">Points Earned</div></div>
        </div>
        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button className={`btn ${tab === 'browse' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('browse')}>🌐 Browse Courses</button>
          <button className={`btn ${tab === 'my' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('my')}>📚 My Courses ({myCourses.length})</button>
        </div>
        {loading ? <div className="loading">⏳</div> : (
          <div className="courses-grid">
            {(tab === 'browse' ? courses : myCourses).map((course, i) => (
              <div key={course.courseid} className="course-card" onClick={() => isEnrolled(course.courseid) && navigate(`/student/course/${course.courseid}`)}>
                <div className={`course-banner ${banners[i % banners.length]}`}>{emojis[i % emojis.length]}</div>
                <div className="course-body">
                  <div className="course-title">{course.title}</div>
                  <div className="course-instructor">👨‍🏫 {course.instructorname}</div>
                  <div className="course-meta">
                    <span className="course-tag">📅 {course.durationmonths} month{course.durationmonths > 1 ? 's' : ''}</span>
                    <span className={`badge ${course.isactive ? 'badge-green' : 'badge-orange'}`}>{course.isactive ? '● Active' : '○ Inactive'}</span>
                  </div>
                  {tab === 'my' ? (
                    <>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: course.status === 'Completed' ? '100%' : '40%' }} /></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-muted">{course.status}</span>
                        <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/student/course/${course.courseid}`); }}>Continue →</button>
                      </div>
                    </>
                  ) : (
                    <button className={`btn btn-sm ${isEnrolled(course.courseid) ? 'btn-success' : 'btn-primary'}`} style={{ width: '100%' }} onClick={e => { e.stopPropagation(); !isEnrolled(course.courseid) && enroll(course.courseid); }}>
                      {isEnrolled(course.courseid) ? '✓ Enrolled' : '+ Enroll Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(tab === 'browse' ? courses : myCourses).length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-state-icon">{tab === 'browse' ? '📭' : '📚'}</div>
                <div className="empty-state-title">{tab === 'browse' ? 'No courses available yet' : 'No courses enrolled yet'}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
