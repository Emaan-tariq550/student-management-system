import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, BookOpen, Edit2, X, Save } from 'lucide-react';

const inputStyle = { width: '100%', padding: '0.7rem 1rem', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 };

const Subjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', class: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch { toast.error('Failed to load subjects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/subjects/${editing}`, form);
        toast.success('Subject updated');
      } else {
        await api.post('/subjects', form);
        toast.success('Subject added');
      }
      setForm({ name: '', code: '', class: '', description: '' });
      setShowForm(false);
      setEditing(null);
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, code: s.code, class: s.class, description: s.description || '' });
    setEditing(s._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success('Deleted');
      fetchSubjects();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Subjects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', code: '', class: '', description: '' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            <Plus size={18} /> Add Subject
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>{editing ? 'Edit Subject' : 'Add Subject'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={labelStyle}>Subject Name *</label><input style={inputStyle} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mathematics" /></div>
              <div><label style={labelStyle}>Subject Code *</label><input style={inputStyle} required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="MATH-101" /></div>
              <div><label style={labelStyle}>Class *</label><input style={inputStyle} required value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} placeholder="10th Grade" /></div>
              <div><label style={labelStyle}>Description</label><input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." /></div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : subjects.length === 0 ? (
        <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
          <BookOpen size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748b' }}>No subjects yet. Add one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {subjects.map(s => (
            <div key={s._id} style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <BookOpen size={22} color="white" />
                </div>
                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(s)} style={{ padding: '0.35rem', background: 'rgba(59,130,246,0.15)', border: 'none', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(s._id)} style={{ padding: '0.35rem', background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <h3 style={{ color: 'white', margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 600 }}>{s.name}</h3>
              <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>{s.code}</span>
              <p style={{ color: '#64748b', margin: '0.75rem 0 0', fontSize: '0.85rem' }}>Class: {s.class}</p>
              {s.description && <p style={{ color: '#64748b', margin: '0.35rem 0 0', fontSize: '0.82rem' }}>{s.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;