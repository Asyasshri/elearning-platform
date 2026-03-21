import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';

export default function UploadVideo() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ title: '', week_number: '', upload_date: '', sequence_number: '' });
  const [file, setFile]       = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
  }, []);

  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr).getDay();
    return d === 0 || d === 6;
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, upload_date: val });
    if (val && isWeekend(val)) {
      setToast({ msg: '❌ Weekdays only! Please select Monday–Friday', type: 'error' });
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.upload_date || !form.week_number || !file) {
      setToast({ msg: 'Please fill all fields and select a video', type: 'warning' }); return;
    }
    if (isWeekend(form.upload_date)) {
      setToast({ msg: '❌ Only weekday uploads allowed', type: 'error' }); return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('video', file);
      data.append('course_id', courseId);
      data.append('title', form.title);
      data.append('week_number', form.week_number);
      data.append('upload_date', form.upload_date);
      data.append('sequence_number', form.sequence_number || 1);
      await api.post('/videos/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setToast({ msg: '🎉 Video uploaded successfully!', type: 'success' });
      setTimeout(() => navigate('/instructor'), 1500);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Upload failed', type: 'error' });
    } finally { setUploading(false); }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#fff', padding: '14px 18px', fontSize: 15,
    width: '100%', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar user={user} />
      <Sidebar role="instructor" />
      <div style={{ marginLeft: 240, paddingTop: 64 }}>
        <div style={{ padding: '40px 36px', maxWidth: 700 }}>
          <button onClick={() => navigate('/instructor')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#A0A0B8', padding: '8px 16px', cursor: 'pointer', fontSize: 13, marginBottom: 28 }}>← Back</button>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>📹 Upload Video</h1>
          <p style={{ color: '#A0A0B8', marginBottom: 32 }}>Course ID: {courseId}</p>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Video Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  placeholder="e.g. Introduction to Variables" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Week Number</label>
                <input value={form.week_number} onChange={e => setForm({ ...form, week_number: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  placeholder="1" type="number" min="1" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Sequence Number</label>
                <input value={form.sequence_number} onChange={e => setForm({ ...form, sequence_number: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  placeholder="1" type="number" min="1" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Upload Date</label>
                <input value={form.upload_date} onChange={handleDateChange}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = isWeekend(form.upload_date) ? '#FF4560' : 'rgba(255,255,255,0.1)'}
                  type="date" style={{ ...inputStyle, borderColor: isWeekend(form.upload_date) ? '#FF4560' : 'rgba(255,255,255,0.1)' }} />
                <p style={{ color: isWeekend(form.upload_date) ? '#FF4560' : '#FFB300', fontSize: 12, marginTop: 6 }}>
                  ⚠️ Weekdays only: Monday to Friday
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div>
              <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 10, display: 'block' }}>Video File</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
                onClick={() => document.getElementById('videoInput').click()}
                style={{
                  border: `2px dashed ${dragOver ? '#6C63FF' : file ? '#00E676' : 'rgba(108,99,255,0.3)'}`,
                  borderRadius: 16, padding: '40px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(108,99,255,0.08)' : file ? 'rgba(0,230,118,0.05)' : 'rgba(108,99,255,0.03)',
                  transition: 'all 0.3s ease',
                }}>
                <input id="videoInput" type="file" accept="video/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                <div style={{ fontSize: 40, marginBottom: 12 }}>{file ? '✅' : '☁️'}</div>
                {file ? (
                  <div>
                    <div style={{ color: '#00E676', fontWeight: 700, marginBottom: 4 }}>{file.name}</div>
                    <div style={{ color: '#A0A0B8', fontSize: 13 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Drag your video here or click to browse</div>
                    <div style={{ color: '#505070', fontSize: 13 }}>MP4, MOV, AVI supported</div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleUpload} disabled={uploading || isWeekend(form.upload_date)}
              onMouseEnter={e => { if (!uploading) e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
              style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '15px', fontSize: 16, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {uploading ? <><Spinner size={20} color="#fff" /> Uploading...</> : '📤 Upload Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}