import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

export default function CreateCourse() {
  const [form, setForm] = useState({ title: '', description: '', duration_months: 1, start_date: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/courses', form);
      setSuccess('✅ Course created!');
      setTimeout(() => navigate('/instructor/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div className="app-layout">
      <Sidebar role="instructor" />
      <div className="main-content">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/instructor/dashboard')} style={{ marginBottom: 20 }}>← Back</button>
        <div className="page-header"><h1 className="page-title">Create New Course</h1></div>
        <div style={{ maxWidth: 600 }}>
          <div className="card">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={submit}>
              <div className="form-group"><label>Course Title</label><input placeholder="e.g. Introduction to Databases" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea placeholder="What will students learn?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} style={{resize:'vertical'}} /></div>
              <div className="form-group"><label>Duration (months)</label>
                <select value={form.duration_months} onChange={e => setForm({...form, duration_months: e.target.value})}>
                  <option value={1}>1 Month</option><option value={2}>2 Months</option><option value={3}>3 Months</option>
                </select>
              </div>
              <div className="form-group"><label>Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required /></div>
              <div className="alert alert-info" style={{ marginBottom: 20 }}>ℹ️ End date is auto-calculated from duration.</div>
              <button className="btn btn-primary" disabled={loading}>{loading ? '⏳ Creating...' : '✓ Create Course'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
