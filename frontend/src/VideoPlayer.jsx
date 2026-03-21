import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animPoints, setAnimPoints] = useState(0);
  const highestPos = useRef(0);
  const canSeek = useRef(false);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      @keyframes slideInSuccess { from{transform:translateY(-30px);opacity:0} to{transform:translateY(0);opacity:1} }
      @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      body{margin:0;background:#0A0A0F;}
    `;
    document.head.appendChild(s);
    fetchVideo();
    return () => { document.head.removeChild(s); if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [videoId]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/videos/${videoId}`);
      setVideo(data);
      const progData = await api.get(`/videos/${videoId}/progress`).catch(() => ({ data: null }));
      if (progData.data?.completed) { setCompleted(true); canSeek.current = true; setProgress(100); }
      else if (progData.data?.watched_percent) {
        const p = parseFloat(progData.data.watched_percent);
        setProgress(p);
        if (p >= 95) { setCompleted(true); canSeek.current = true; }
      }
    } catch { show('Failed to load video', 'error'); }
    finally { setLoading(false); }
  };

  const saveProgress = useCallback(async (pct) => {
    try { await api.post(`/videos/${videoId}/progress`, { watched_percent: Math.round(pct) }); } catch {}
  }, [videoId]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || v.duration === 0) return;
    const current = v.currentTime;
    const pct = (current / v.duration) * 100;
    if (current > highestPos.current) highestPos.current = current;
    setProgress(prev => Math.max(prev, pct));
    if (pct >= 95 && !completed) { setCompleted(true); canSeek.current = true; handleCompletion(); }
  };

  const handleSeeking = () => {
    const v = videoRef.current;
    if (!v || canSeek.current) return;
    if (v.currentTime > highestPos.current + 1) { v.currentTime = highestPos.current; show('⚠️ Watch fully to unlock seeking!', 'warning'); }
  };

  const handleCompletion = async () => {
    try {
      await api.post(`/videos/${videoId}/complete`);
      setShowSuccess(true);
      let pts = 0;
      const interval = setInterval(() => { pts += 2; setAnimPoints(pts); if (pts >= 50) clearInterval(interval); }, 40);
    } catch {}
  };

  useEffect(() => {
    if (!loading && videoRef.current) {
      progressInterval.current = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused) {
          const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          saveProgress(pct);
        }
      }, 8000);
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [loading, saveProgress]);

  const confettiColors = ['#6C63FF','#00D4FF','#FF6B9D','#FFD700','#00E676'];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={48} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <ToastContainer />
      {showSuccess && [...Array(20)].map((_, i) => (
        <div key={i} style={{ position: 'fixed', top: 0, left: `${Math.random()*100}%`, width: 10, height: 10, background: confettiColors[i % confettiColors.length], borderRadius: i % 2 === 0 ? '50%' : 2, animation: `confettiFall ${2+Math.random()*2}s ease-out ${Math.random()}s both`, zIndex: 200, pointerEvents: 'none' }} />
      ))}

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, background: 'rgba(10,10,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, zIndex: 100 }}>
        <button onClick={() => navigate(-1)}
          onMouseEnter={e => e.target.style.background = 'rgba(108,99,255,0.2)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{video?.title}</h1>
          <span style={{ color: '#505070', fontSize: 12 }}>Week {video?.week_number}</span>
        </div>
        {completed && <div style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 10, padding: '6px 14px', color: '#00E676', fontSize: 13, fontWeight: 600 }}>✅ Completed</div>}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#000', marginBottom: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.6)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {video?.cloudinary_url ? (
            <video ref={videoRef} src={video.cloudinary_url} controls width="100%" height="100%"
              style={{ borderRadius: 20 }} onTimeUpdate={handleTimeUpdate} onSeeking={handleSeeking} />
          ) : (
            <div style={{ color: '#505070', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎬</div>
              <p>Video not available</p>
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: '#A0A0B8', fontSize: 14 }}>Watch Progress</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: progress >= 95 ? 'linear-gradient(90deg,#00E676,#00D4FF)' : 'linear-gradient(90deg,#6C63FF,#00D4FF)', borderRadius: 100, transition: 'width 0.3s ease' }} />
          </div>
          {!completed && progress < 95 && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)', borderRadius: 10 }}>
              <span>🔒</span>
              <span style={{ color: '#FFB300', fontSize: 13 }}>Watch at least 95% to earn 50 points and unlock controls</span>
            </div>
          )}
        </div>

        {showSuccess && (
          <div style={{ animation: 'slideInSuccess 0.5s cubic-bezier(0.4,0,0.2,1)', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 48, animation: 'pulse 1s ease 3' }}>🎉</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#00E676', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Video Completed!</h3>
              <p style={{ color: '#A0A0B8', fontSize: 14 }}>You've unlocked full video controls and earned your points.</p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,215,0,0.1)', borderRadius: 14, padding: '16px 24px', border: '1px solid rgba(255,215,0,0.3)' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFD700' }}>+{animPoints}</div>
              <div style={{ color: '#A0A0B8', fontSize: 12 }}>Points earned</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;