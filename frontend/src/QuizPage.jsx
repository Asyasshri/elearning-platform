import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';
import CircularProgress from '../../components/CircularProgress';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate   = useNavigate();
  const [user, setUser]           = useState(null);
  const [quiz, setQuiz]           = useState(null);
  const [answers, setAnswers]     = useState({});
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    api.get(`/quizzes/${quizId}`)
      .then(r => { setQuiz(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [quizId]);

  const handleAnswer = (qid, opt) => setAnswers(prev => ({ ...prev, [qid]: opt }));

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      setToast({ msg: 'Please answer all questions', type: 'warning' }); return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers });
      setResult(res.data);
      setShowModal(true);
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Submission failed', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const answered   = Object.keys(answers).length;
  const total      = quiz?.questions?.length || 0;
  const allAnswered = answered === total && total > 0;

  if (loading) return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={48} />
    </div>
  );

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar user={user} />

      {/* Result Modal */}
      {showModal && result && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 48, textAlign: 'center', maxWidth: 400, width: '90%', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress percentage={result.percentage} size={120} strokeWidth={10} color={result.percentage >= 60 ? '#00E676' : '#FF4560'} />
            </div>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              {result.percentage >= 60 ? '🎉 Great Job!' : '😔 Keep Trying!'}
            </h2>
            <p style={{ color: '#A0A0B8', fontSize: 16, marginBottom: 8 }}>
              You scored <span style={{ color: '#fff', fontWeight: 700 }}>{result.score}</span> out of <span style={{ color: '#fff', fontWeight: 700 }}>{result.total}</span>
            </p>
            <p style={{ fontSize: 32, fontWeight: 900, color: result.percentage >= 60 ? '#00E676' : '#FF4560', marginBottom: 24 }}>{result.percentage}%</p>
            <div style={{ background: result.percentage >= 60 ? 'rgba(0,230,118,0.1)' : 'rgba(255,69,96,0.1)', border: `1px solid ${result.percentage >= 60 ? 'rgba(0,230,118,0.3)' : 'rgba(255,69,96,0.3)'}`, borderRadius: 12, padding: '10px 20px', marginBottom: 24, color: result.percentage >= 60 ? '#00E676' : '#FF4560', fontWeight: 600 }}>
              {result.percentage >= 60 ? '✅ Passed' : '❌ Failed — Score 60% to pass'}
            </div>
            <button onClick={() => { setShowModal(false); navigate(-1); }}
              style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', border: 'none', borderRadius: 12, color: '#fff', padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Back to Course
            </button>
          </div>
        </div>
      )}

      <div style={{ paddingTop: 80, maxWidth: 800, margin: '0 auto', padding: '80px 24px 48px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: 13, marginBottom: 24 }}>← Back</button>

        <div style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,255,0.08))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 20, padding: '28px', marginBottom: 32 }}>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>📝 {quiz?.title}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '6px 16px', color: '#A0A0B8', fontSize: 13 }}>📊 {total} Questions</div>
            <div style={{ background: answered === total && total > 0 ? 'rgba(0,230,118,0.15)' : 'rgba(255,179,0,0.15)', border: `1px solid ${answered === total && total > 0 ? 'rgba(0,230,118,0.3)' : 'rgba(255,179,0,0.3)'}`, borderRadius: 20, padding: '6px 16px', color: answered === total && total > 0 ? '#00E676' : '#FFB300', fontSize: 13, fontWeight: 600 }}>
              ✏️ {answered}/{total} Answered
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(135deg,#6C63FF,#00D4FF)', width: `${total > 0 ? (answered/total)*100 : 0}%`, transition: 'width 0.3s ease', borderRadius: 100 }} />
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
          {quiz?.questions?.map((q, qi) => (
            <div key={q.questionid} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', transition: 'border-color 0.3s ease' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: answers[q.questionid] ? 'linear-gradient(135deg,#6C63FF,#00D4FF)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {answers[q.questionid] ? '✓' : qi + 1}
                </div>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{q.questiontext}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['a','b','c','d'].map(opt => {
                  const label = q[`option${opt.toUpperCase()}`];
                  if (!label) return null;
                  const selected = answers[q.questionid] === opt;
                  return (
                    <button key={opt} onClick={() => handleAnswer(q.questionid, opt)}
                      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)'; e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; } }}
                      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                        background: selected ? 'linear-gradient(135deg,rgba(108,99,255,0.4),rgba(0,212,255,0.2))' : 'rgba(255,255,255,0.03)',
                        border: selected ? '1px solid rgba(108,99,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
                        color: selected ? '#fff' : '#A0A0B8', fontSize: 14, fontWeight: selected ? 600 : 400,
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: selected ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{opt.toUpperCase()}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!allAnswered || submitting}
          onMouseEnter={e => { if (allAnswered) e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
          style={{
            width: '100%', background: allAnswered ? 'linear-gradient(135deg,#00E676,#00B0FF)' : 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: 14, color: allAnswered ? '#fff' : '#505070',
            padding: '16px', fontSize: 16, fontWeight: 700,
            cursor: allAnswered && !submitting ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: allAnswered ? '0 8px 32px rgba(0,230,118,0.3)' : 'none',
          }}>
          {submitting ? <><Spinner size={20} color="#fff" /> Submitting...</> : allAnswered ? '🚀 Submit Quiz' : `Answer all ${total} questions to submit`}
        </button>
      </div>
    </div>
  );
}