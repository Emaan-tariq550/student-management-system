import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', rollNumber: '', age: '', gender: 'Male',
    class: '', section: 'A', email: '', phone: '',
    address: '', guardianName: '', guardianPhone: '', dateOfBirth: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('profileImage', image);
      await api.post('/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/students')} style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Add New Student</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
          {/* Profile Image */}
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)', gridColumn: '1 / -1' }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem', fontSize: '1rem' }}>Profile Photo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '2px dashed rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {imagePreview ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={24} color="#6366f1" />}
              </div>
              <div>
                <label style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  Choose Photo
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                </label>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter your name" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Age *</label><input style={inputStyle} type="number" required min="5" max="30" value={form.age} onChange={e => set('age', e.target.value)} /></div>
                <div><label style={labelStyle}>Gender *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Date of Birth</label><input style={inputStyle} type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} /></div>
              <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@school.edu" /></div>
              <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 0000000" /></div>
              <div><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, Country" /></div>
            </div>
          </div>

          {/* Academic Info */}
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Academic & Guardian Info</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={labelStyle}>Roll Number *</label><input style={inputStyle} required value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} placeholder="STU-001" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Class *</label><input style={inputStyle} required value={form.class} onChange={e => set('class', e.target.value)} placeholder="10th Grade" /></div>
                <div><label style={labelStyle}>Section *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.section} onChange={e => set('section', e.target.value)}>
                    {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guardian Information</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><label style={labelStyle}>Guardian Name</label><input style={inputStyle} value={form.guardianName} onChange={e => set('guardianName', e.target.value)} placeholder="Parent / Guardian" /></div>
                  <div><label style={labelStyle}>Guardian Phone</label><input style={inputStyle} value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} placeholder="+92 300 0000000" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/students')} style={{ padding: '0.75rem 1.5rem', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> {loading ? 'Saving...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;