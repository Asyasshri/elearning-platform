import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/mine').then(r => { setCerts(r.data); setLoading(false); });
  }, []);

  return (
    <div className="app-layout">
      <Sidebar role="student" />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">🎓 My Certificates</h1>
          <p className="page-subtitle">Your earned certificates for completed courses</p>
        </div>
        {loading ? <div className="loading">⏳</div> : certs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <div className="empty-state-title">No certificates yet</div>
            <p className="text-muted">Complete all videos in a course to earn your certificate!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {certs.map(cert => (
              <div key={cert.certificateid} className="cert-card">
                <div style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Certificate of Completion</div>
                <div className="cert-title">{cert.coursetitle}</div>
                <div className="cert-instructor">👨‍🏫 {cert.instructorname}</div>
                <div className="divider" />
                <div style={{ marginBottom: 12 }}>
                  <div className="text-muted" style={{ marginBottom: 6 }}>Issued on</div>
                  <div style={{ fontWeight: 600 }}>{new Date(cert.issuedate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="cert-code">{cert.uniquecode}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
