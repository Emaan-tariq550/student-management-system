import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Trash2, Shield } from 'lucide-react';

const roleColors = { admin: '#ef4444', teacher: '#3b82f6', student: '#10b981' };

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/auth/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          <Shield size={22} style={{ display: 'inline', marginRight: '0.5rem', color: '#6366f1' }} />
          User Management
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.85rem' }}>{users.length} registered users</p>
      </div>

      <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
              ) : users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${roleColors[u.role] || '#6366f1'}33`, border: `2px solid ${roleColors[u.role] || '#6366f1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColors[u.role] || '#818cf8', fontWeight: 700, fontSize: '0.9rem' }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <span style={{ color: 'white', fontWeight: 500 }}>{u.name} {u._id === currentUser._id && <span style={{ color: '#818cf8', fontSize: '0.75rem' }}>(you)</span>}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    {u._id === currentUser._id ? (
                      <span style={{ background: `${roleColors[u.role]}22`, color: roleColors[u.role], padding: '0.25rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{u.role}</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        style={{ padding: '0.35rem 0.75rem', background: `${roleColors[u.role]}22`, border: `1px solid ${roleColors[u.role]}44`, borderRadius: '6px', color: roleColors[u.role], fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u._id !== currentUser._id && (
                      <button onClick={() => handleDelete(u._id)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
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

export default Users;