import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Save, Filter } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [filters, setFilters] = useState({ subject: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/students?limit=1000').then(r => setStudents(r.data.students));
    api.get('/subjects').then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (!filters.subject || !filters.date) return;
    setLoading(true);
    api.get('/attendance', { params: { subject: filters.subject, date: filters.date } })
      .then(r => {
        setRecords(r.data);
        const map = {};
        r.data.forEach(rec => { map[rec.student?._id] = rec.status; });
        setAttendance(map);
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [filters.subject, filters.date]);

  const handleSave = async () => {
    if (!filters.subject || !filters.date) return toast.error('Select subject and date');
    setSaving(true);
    try {
      const bulk = students.map(s => ({
        student: s._id,
        subject: filters.subject,
        date: filters.date,
        status: attendance[s._id] || 'Absent'
      }));
      await api.post('/attendance/bulk', { records: bulk });
      toast.success('Attendance saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const statusBtn = (studentId, status, color) => (
    <button
      onClick={() => setStatus(studentId, status)}
      style={{
        padding: '0.35rem 0.8rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
        fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
        background: attendance[studentId] === status ? color : 'rgba(255,255,255,0.05)',
        color: attendance[studentId] === status ? 'white' : '#64748b',
      }}
    >
      {status}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Attendance</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: saving ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 }}>Subject</label>
          <select
            value={filters.subject}
            onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}
            style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: 'white', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 }}>Date</label>
          <input
            type="date" value={filters.date}
            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
            style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden' }}>
        {!filters.subject ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Filter size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Select a subject to mark attendance</p>
          </div>
        ) : loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                  {['#', 'Student', 'Roll No.', 'Class', 'Status'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{i + 1}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                          {s.name[0]}
                        </div>
                        <span style={{ color: 'white', fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.rollNumber}</td>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.class}-{s.section}</td>
                    <td style={{ padding: '1rem' }}>
                      {(user?.role === 'admin' || user?.role === 'teacher') ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {statusBtn(s._id, 'Present', '#10b981')}
                          {statusBtn(s._id, 'Absent', '#ef4444')}
                          {statusBtn(s._id, 'Late', '#f59e0b')}
                        </div>
                      ) : (
                        <span style={{
                          padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600,
                          background: attendance[s._id] === 'Present' ? 'rgba(16,185,129,0.15)' : attendance[s._id] === 'Absent' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                          color: attendance[s._id] === 'Present' ? '#10b981' : attendance[s._id] === 'Absent' ? '#ef4444' : '#f59e0b',
                        }}>
                          {attendance[s._id] || 'Not Marked'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;