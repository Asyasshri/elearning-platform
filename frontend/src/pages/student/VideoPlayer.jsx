import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

export default function VideoPlayer() {
  const { videoId, enrollmentId } = useParams();
  const [canSeek, setCanSeek] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);
  const lastPos = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/videos/${videoId}/status/${enrollmentId}`).then(r => {
      setCanSeek(r.data.CanSeek);
      setCompleted(r.data.IsCompleted);
    });
  }, [videoId, enrollmentId]);

  const handleProgress = ({ playedSeconds, played }) => {
    setProgress(Math.round(played * 100));
    if (!canSeek && playedSeconds > lastPos.current + 2.5) {
      playerRef.current.seekTo(lastPos.current, 'seconds');
      return;
    }
    lastPos.current = playedSeconds;
    if (Math.round(playedSeconds) % 8 === 0 && Math.round(playedSeconds) > 0) {
      api.post(`/videos/${videoId}/progress`, {
        enrollment_id: parseInt(enrollmentId),
        watched_sec: Math.round(playedSeconds),
        total_sec: Math.round(duration),
      }).then(r => {
        if (r.data.isCompleted && !completed) {
          setCompleted(true);
          setCanSeek(true);
        }
      });
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role="student" />
      <div className="main-content">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>
        <div className="video-page">
          {!canSeek && <div className="video-warning">⚠️ Watch the full video without skipping to earn <strong>50 points</strong></div>}
          {completed && <div className="alert alert-success">🎉 Video completed! You earned <strong>50 points</strong>.</div>}
          <div className="video-wrapper">
            <ReactPlayer ref={playerRef} url="" controls={canSeek} width="100%" height="480px" onDuration={d => setDuration(d)} onProgress={handleProgress} />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Watch Progress</span>
              <span style={{ color: 'var(--primary-light)' }}>{progress}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span className="text-muted">🎯 Complete 95% to earn 50 points</span>
              <span className={`badge ${completed ? 'badge-green' : 'badge-purple'}`}>{completed ? '✓ Completed' : '⏳ In Progress'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
