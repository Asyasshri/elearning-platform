import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

const banners = ['course-banner-1','course-banner-2','course-banner-3','course-banner-4','course-banner-5','course-banner-6'];
const emojis = ['📚','💡','🔬','🎯','🚀','⚡'];

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then(r => {
      const userId = parseInt(localStorage.getItem('userId'));
      setCourses(r.data.filter(c => c.instructorid === userId));
      setLoading(false);
    });
  }, []);

  return (
    <div className="app-layout">
      <Sidebar role="instructor" />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Hello, {name} 👋</h1>
          <p className="page-subtitle">Manage your courses, videos and quizzes</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{courses.length}</div><div className="stat-label">Your Courses</div></div>
          <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{courses.filter(c => c.isactive).length}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-icon">📹</div><div className="stat-value">—</div><div className="stat-label">Videos</div></div>
          <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value">—</div><div className="stat-label">Quizzes</div></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18 }}>Your Courses</h2>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/instructor/create-course')}>+ Create Course</button>
        </div>
        {loading ? <div className="loading">⏳</div> : (
          <div className="courses-grid">
            {courses.map((course, i) => (
              <div key={course.courseid} className="course-card">
                <div className={`course-banner ${banners[i % banners.length]}`}>{emojis[i % emojis.length]}</div>
                <div className="course-body">
                  <div className="course-title">{course.title}</div>
                  <div className="course-meta">
                    <span className="course-tag">📅 {course.durationmonths} month{course.durationmonths > 1 ? 's' : ''}</span>
                    <span className={`badge ${course.isactive ? 'badge-green' : 'badge-orange'}`}>{course.isactive ? '● Active' : '○ Inactive'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => navigate(`/instructor/upload-video?courseId=${course.courseid}`)}>📹 Add Video</button>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => navigate(`/instructor/create-quiz?courseId=${course.courseid}`)}>📝 Add Quiz</button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-title">No courses yet</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/instructor/create-course')}>+ Create First Course</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
