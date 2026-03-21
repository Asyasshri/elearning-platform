import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProgressBar from '../../components/ProgressBar';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); body{margin:0;background:#0A0A0F;}`;
    document.head.appendChild(s);
    fetchAll();
    return () => document.head.removeChild(s);
  }, [courseId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [courseRes, videoRes, quizRes, progRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/videos`),
        api.get(`/courses/${courseId}/quizzes`),
        api.get(`/courses/${courseId}/progress`).catch(() => ({ data: [] })),
      ]);
      setCourse(courseRes.data);
      setVideos(videoRes.data || []);
      setQuizzes(quizRes.data || []);
      setProgress(progRes.data || []);
    } catch (err) { show('Failed to load course details', 'error'); }
    finally { setLoading(false); }
  };

  const getVideoStatus = (video) => {
    const p = progress.find(p => p.videoid === video.videoid);
    if (p?.completed) return 'completed';
    if (p?.watched_percent > 0) return 'in-progress';
    return 'locked';
  };

  const completedCount = videos.filter(v => {
    const p = progress.find(p => p.videoid === v.videoid);
    return p?.completed;
  }).length;

  const completionPct = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;
  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={48} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}>
      <ToastContainer />
      <Navbar user={user} />
      <Sidebar role="student" />

      <main style={{ marginLeft: 240, padding: '80px 32px 40px 272px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: '#505070', fontSize: 13 }}>
          <span style={{ cursor: 'pointer', color: '#6C63FF' }} onClick={() => navigate('/student')}>Dashboard</span>
          <span>›</span><span style={{ color: '#fff' }}>{course?.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', padding: '28px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📚</div>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1.3, marginBottom: 6 }}>{course?.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>👨‍🏫 {course?.instructor_name}</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>⏱ {course?.duration_months} month{course?.duration_months > 1 ? 's' : ''}</span>
                  <span style={{ background: 'rgba(0,230,118,0.15)', color: '#00E676', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{completedCount}/{videos.length} videos</span>
                </div>
                <ProgressBar value={completionPct} max={100} height={8} />
              </div>
            </div>

            <div style={{ ...card, padding: 16 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14, paddingLeft: 4 }}>🎬 Course Videos</h3>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {videos.length === 0 ? (
                  <p style={{ color: '#505070', textAlign: 'center', padding: 20, fontSize: 14 }}>No videos uploaded yet</p>
                ) : videos.map((video, i) => {
                  const status = getVideoStatus(video);
                  return (
                    <div key={video.videoid}
                      onClick={() => navigate(`/student/video/${video.videoid}/${courseId}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, cursor: 'pointer', background: status === 'in-progress' ? 'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,255,0.1))' : 'transparent', border: status === 'in-progress' ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent', marginBottom: 6, transition: 'all 0.2s' }}
                      onMouseEnter={e => { if (status !== 'in-progress') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (status !== 'in-progress') e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: status === 'completed' ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: status === 'completed' ? '#00E676' : '#fff', flexShrink: 0 }}>
                        {status === 'completed' ? '✓' : i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
                        <div style={{ color: '#505070', fontSize: 11 }}>Week {video.week_number}</div>
                      </div>
                      <span style={{ fontSize: 16 }}>{status === 'completed' ? '✅' : status === 'in-progress' ? '▶️' : '🔒'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ ...card, padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: '🎬', val: videos.length, label: 'Videos' },
                  { icon: '📝', val: quizzes.length, label: 'Quizzes' },
                  { icon: '✅', val: `${completionPct}%`, label: 'Complete' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{s.val}</div>
                    <div style={{ color: '#A0A0B8', fontSize: 12 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, padding: 28 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>📝 Quizzes & Assessments</h3>
              {quizzes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p style={{ color: '#A0A0B8' }}>No quizzes available yet</p>
                </div>
              ) : quizzes.map(quiz => {
                const isWeekend = [0, 6].includes(new Date().getDay());
                return (
                  <div key={quiz.quizid} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Week {quiz.week_number}</span>
                        <span style={{ background: isWeekend ? 'rgba(0,230,118,0.15)' : 'rgba(255,179,0,0.15)', color: isWeekend ? '#00E676' : '#FFB300', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{isWeekend ? '✅ Available' : '⏰ Weekends Only'}</span>
                      </div>
                      <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{quiz.title}</h4>
                    </div>
                    <button onClick={() => navigate(`/student/quiz/${quiz.quizid}`)} disabled={!isWeekend}
                      onMouseEnter={e => { if (isWeekend) e.target.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                      style={{ background: isWeekend ? 'linear-gradient(135deg,#6C63FF,#00D4FF)' : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, color: isWeekend ? '#fff' : '#505070', padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: isWeekend ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                      {isWeekend ? '▶ Attempt' : '🔒 Locked'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;