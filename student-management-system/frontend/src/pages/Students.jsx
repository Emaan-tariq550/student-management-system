import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';

const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/students', { params: { search, page, limit: 10, class: classFilter } });
      setStudents(data.students);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, page, classFilter]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search, classFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setDeleting(id);
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetch();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Students</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>{total} total students</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <Link to="/students/add" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', color: 'white', textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: 600
          }}>
            <Plus size={18} /> Add Student
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, roll number..."
            style={{
              width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem',
              background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '10px', color: 'white', fontSize: '0.9rem',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <input
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          placeholder="Filter by class..."
          style={{
            padding: '0.7rem 1rem', background: 'rgba(30,41,59,0.8)',
            border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px',
            color: 'white', fontSize: '0.9rem', outline: 'none', minWidth: '150px'
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                {['Student', 'Roll No.', 'Class', 'Section', 'Gender', 'Email', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No students found</td></tr>
              ) : students.map((s, i) => (
                <tr key={s._id} style={{ borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 700, color: 'white', flexShrink: 0
                      }}>
                        {s.profileImage ? <img src={`http://localhost:5000${s.profileImage}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : s.name[0].toUpperCase()}
                      </div>
                      <span style={{ color: 'white', fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.rollNumber}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.class}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{s.section}</span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.gender}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{s.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(user?.role === 'admin' || user?.role === 'teacher') && (
                        <button onClick={() => navigate(`/students/edit/${s._id}`)} style={{
                          padding: '0.4rem 0.75rem', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                          borderRadius: '8px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem'
                        }}>
                          <Edit2 size={14} /> Edit
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id} style={{
                          padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem'
                        }}>
                          <Trash2 size={14} /> {deleting === s._id ? '...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '8px', color: page === 1 ? '#64748b' : '#818cf8', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '8px', color: page === pages ? '#64748b' : '#818cf8', cursor: page === pages ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;