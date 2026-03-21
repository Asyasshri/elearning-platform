import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';

export default function CreateQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [form, setForm]       = useState({ title: '', week_number: '', quiz_date: '' });
  const [questions, setQuestions] = useState([{ text: '', a: '', b: '', c: '', d: '', correct: 'a' }]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]     = useState(null);

  useEffect(() => { const u = JSON.parse(localStorage.getItem('user') || 'null'); setUser(u); }, []);

  const isWeekday = (d) => { if (!d) return false; const day = new Date(d).getDay(); return day !== 0 && day !== 6; };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, quiz_date: val });
    if (val && isWeekday(val)) setToast({ msg: '❌ Weekends only! Saturday or Sunday', type: 'error' });
  };

  const addQuestion = () => setQuestions([...questions, { text: '', a: '', b: '', c: '', d: '', correct: 'a' }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, qi) => qi !== i));
  const updateQ = (i, field, val) => { const q = [...questions]; q[i][field] = val; setQuestions(q); };

  const handleSubmit = async () => {
    if (!form.title || !form.quiz_date || !form.week_number) { setToast({ msg: 'Fill all fields', type: 'warning' }); return; }
    if (isWeekday(form.quiz_date)) { setToast({ msg: 'Quiz must be on weekend', type: 'error' }); return; }
    setSubmitting(true);
    try {
      await api.post('/quizzes', { course_id: courseId, title: form.title, week_number: form.week_number, quiz_date: form.quiz_date, questions });
      setToast({ msg: '🎉 Quiz created!', type: 'success' });
      setTimeout(() => navigate('/instructor'), 1500);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Failed to create quiz', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', padding: '12px 16px', fontSize: 14, width: '100%', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar user={user} />
      <Sidebar role="instructor" />
      <div style={{ marginLeft: 240, paddingTop: 64 }}>
        <div style={{ padding: '40px 36px', maxWidth: 800 }}>
          <button onClick={() => navigate('/instructor')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#A0A0B8', padding: '8px 16px', cursor: 'pointer', fontSize: 13, marginBottom: 28 }}>← Back</button>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>📝 Create Quiz</h1>
          <p style={{ color: '#A0A0B8', marginBottom: 32 }}>Course ID: {courseId}</p>

          {/* Quiz Info */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', marginBottom: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 20 }}>Quiz Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Quiz Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Week 1 Quiz" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Week Number</label>
                <input value={form.week_number} onChange={e => setForm({ ...form, week_number: e.target.value })} onFocus={e => e.target.style.borderColor = '#6C63FF'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="1" type="number" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Quiz Date</label>
                <input value={form.quiz_date} onChange={handleDateChange} type="date" style={{ ...inputStyle, borderColor: form.quiz_date && isWeekday(form.quiz_date) ? '#FF4560' : 'rgba(255,255,255,0.1)' }} />
                <p style={{ color: '#FFB300', fontSize: 11, marginTop: 4 }}>⚠️ Weekends only: Sat & Sun</p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ color: '#fff', fontWeight: 700 }}>Questions ({questions.length})</h3>
              <button onClick={addQuestion} onMouseEnter={e => e.target.style.background = 'linear-gradient(135deg,#6C63FF,#00D4FF)'} onMouseLeave={e => e.target.style.background = 'rgba(108,99,255,0.15)'}
                style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, color: '#6C63FF', padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.3s ease' }}>
                ➕ Add Question
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {questions.map((q, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(i)} style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 8, color: '#FF4560', padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}>✕ Remove</button>
                    )}
                  </div>
                  <textarea value={q.text} onChange={e => updateQ(i, 'text', e.target.value)} placeholder="Enter your question here..." rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', marginBottom: 14 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {['a','b','c','d'].map(opt => (
                      <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#6C63FF', fontWeight: 700, width: 20, fontSize: 14 }}>{opt.toUpperCase()}</span>
                        <input value={q[opt]} onChange={e => updateQ(i, opt, e.target.value)} placeholder={`Option ${opt.toUpperCase()}`}
                          style={{ ...inputStyle, flex: 1 }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ color: '#A0A0B8', fontSize: 13, marginBottom: 8, display: 'block' }}>Correct Answer</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['a','b','c','d'].map(opt => (
                        <button key={opt} onClick={() => updateQ(i, 'correct', opt)}
                          style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${q.correct === opt ? '#00E676' : 'rgba(255,255,255,0.1)'}`, background: q.correct === opt ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.04)', color: q.correct === opt ? '#00E676' : '#A0A0B8', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s ease' }}>
                          {opt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
            style={{ width: '100%', background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '15px', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {submitting ? <><Spinner size={20} color="#fff" /> Creating Quiz...</> : '🚀 Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
