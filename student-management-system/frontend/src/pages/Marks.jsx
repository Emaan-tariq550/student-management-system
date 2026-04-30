import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, X, Save } from 'lucide-react';

const inputStyle = { width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' };
const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 };

const gradeColor = { 'A+': '#10b981', 'A': '#10b981', 'B': '#3b82f6', 'C': '#f59e0b', 'D': '#f97316', 'F': '#ef4444' };

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student: '', subject: '', examType: 'Quiz', marks: '', totalMarks: 100, remarks: '' });
  const [filterStudent, setFilterStudent] = useState('');

  const fetchMarks = async () => {
    try {
      const { data } = await api.get('/marks', { params: filterStudent ? { student: filterStudent } : {} });
      setMarks(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get('/students?limit=1000').then(r => setStudents(r.data.students));
    api.get('/subjects').then(r => setSubjects(r.data));
  }, []);

  useEffect(() => { fetchMarks(); }, [filterStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/marks', form);
      toast.success('Marks added!');
      setForm({ student: '', subject: '', examType: 'Quiz', marks: '', totalMarks: 100, remarks: '' });
      setShowForm(false);
      fetchMarks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/marks/${id}`);
      toast.success('Deleted');
      fetchMarks();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Marks & Grades</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            <Plus size={18} /> Add Marks
          </button>
        )}
      </div>

      {/* Filter */}
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <div style={{ marginBottom: '1.5rem' }}>
          <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)}
            style={{ padding: '0.7rem 1rem', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: 'white', outline: 'none', cursor: 'pointer', minWidth: '220px' }}>
            <option value="">All Students</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
          </select>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>Add Marks</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Student *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} required value={form.student} onChange={e => setForm(f => ({ ...f, student: e.target.value }))}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Exam Type *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.examType} onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}>
                  {['Quiz', 'Midterm', 'Final', 'Assignment'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Marks Obtained *</label><input style={inputStyle} type="number" required min="0" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} /></div>
                <div><label style={labelStyle}>Total Marks *</label><input style={inputStyle} type="number" required min="1" value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} /></div>
              </div>
              <div><label style={labelStyle}>Remarks</label><input style={inputStyle} value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Optional remarks..." /></div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                {['Student', 'Subject', 'Exam Type', 'Marks', 'Grade', 'Remarks', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
              ) : marks.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No marks records yet</td></tr>
              ) : marks.map((m, i) => (
                <tr key={m._id} style={{ borderBottom: i < marks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '1rem', color: 'white', fontWeight: 500 }}>{m.student?.name}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{m.subject?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{m.examType}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'white' }}>{m.marks} / {m.totalMarks} <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({((m.marks / m.totalMarks) * 100).toFixed(0)}%)</span></td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: (gradeColor[m.grade] || '#6366f1') + '22', color: gradeColor[m.grade] || '#818cf8', padding: '0.2rem 0.75rem', borderRadius: '6px', fontWeight: 700 }}>{m.grade}</span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{m.remarks || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {(user?.role === 'admin' || user?.role === 'teacher') && (
                      <button onClick={() => handleDelete(m._id)} style={{ padding: '0.35rem 0.7rem', background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marks;