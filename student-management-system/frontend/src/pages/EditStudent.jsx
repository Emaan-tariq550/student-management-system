import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Upload } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '10px', color: 'white', fontSize: '0.9rem',
  outline: 'none', boxSizing: 'border-box'
};
const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 };

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', rollNumber: '', age: '', gender: 'Male',
    class: '', section: 'A', email: '', phone: '',
    address: '', guardianName: '', guardianPhone: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/students/${id}`);
        setForm({
          name: data.name || '', rollNumber: data.rollNumber || '',
          age: data.age || '', gender: data.gender || 'Male',
          class: data.class || '', section: data.section || 'A',
          email: data.email || '', phone: data.phone || '',
          address: data.address || '', guardianName: data.guardianName || '',
          guardianPhone: data.guardianPhone || ''
        });
        if (data.profileImage) setImagePreview(`http://localhost:5000${data.profileImage}`);
      } catch {
        toast.error('Failed to load student');
        navigate('/students');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('profileImage', image);
      await api.put(`/students/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Student updated!');
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/students')} style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Edit Student</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Profile Image */}
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)', gridColumn: '1 / -1' }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem', fontSize: '1rem' }}>Profile Photo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '2px dashed rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {imagePreview ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={24} color="#6366f1" />}
              </div>
              <label style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                Change Photo
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImage(f); setImagePreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={labelStyle}>Full Name</label><input style={inputStyle} required value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Age</label><input style={inputStyle} type="number" value={form.age} onChange={e => set('age', e.target.value)} /></div>
                <div><label style={labelStyle}>Gender</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
              <div><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} /></div>
            </div>
          </div>

          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Academic & Guardian</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={labelStyle}>Roll Number</label><input style={inputStyle} required value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Class</label><input style={inputStyle} required value={form.class} onChange={e => set('class', e.target.value)} /></div>
                <div><label style={labelStyle}>Section</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.section} onChange={e => set('section', e.target.value)}>
                    {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Guardian Name</label><input style={inputStyle} value={form.guardianName} onChange={e => set('guardianName', e.target.value)} /></div>
              <div><label style={labelStyle}>Guardian Phone</label><input style={inputStyle} value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/students')} style={{ padding: '0.75rem 1.5rem', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;