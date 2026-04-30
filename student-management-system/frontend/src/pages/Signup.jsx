import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', phone: '', address: '',
    rollNumber: '', age: '', gender: 'Male', class: '', section: 'A',
    guardianName: '', guardianPhone: '', dateOfBirth: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 500;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      await signup(submitData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '10px', color: 'white', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 500 };
  const fieldStyle = { marginBottom: '1rem' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', boxShadow: '0 0 30px rgba(99,102,241,0.4)'
          }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Create Account</h1>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, form.role === 'student' ? 2 : null].filter(Boolean).map(s => (
            <div key={s} style={{
              width: step >= s ? '2rem' : '0.5rem', height: '0.5rem',
              borderRadius: '99px', transition: 'all 0.3s',
              background: step >= s ? '#6366f1' : 'rgba(99,102,241,0.3)'
            }} />
          ))}
        </div>

        <div style={{
          background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', padding: isMobile ? '1.25rem' : '2rem',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Account Information</h3>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Muhammad Ali" />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Email Address</label>
                  <input style={inputStyle} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="ali@school.edu" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input style={{ ...inputStyle, paddingRight: '2.5rem' }} type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••" />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input style={inputStyle} type="password" required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••" />
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Role</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 0000000" />
                  </div>
                  <div>
                    <label style={labelStyle}>Address</label>
                    <input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, Country" />
                  </div>
                </div>

                {form.role === 'student' ? (
                  <button type="button" onClick={() => setStep(2)} style={{
                    width: '100%', padding: '0.875rem',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '10px', color: 'white',
                    fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}>
                    Next: Student Details <ChevronRight size={18} />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '0.875rem',
                    background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '10px', color: 'white',
                    fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && form.role === 'student' && (
              <>
                <h3 style={{ color: 'white', margin: '0 0 1.25rem', fontSize: '1rem' }}>Student Profile Details</h3>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Roll Number</label>
                    <input style={inputStyle} required value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} placeholder="STU-001" />
                  </div>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input style={inputStyle} type="number" required min="5" max="30" value={form.age} onChange={e => set('age', e.target.value)} placeholder="16" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input style={inputStyle} type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Class</label>
                    <input style={inputStyle} required value={form.class} onChange={e => set('class', e.target.value)} placeholder="10th Grade" />
                  </div>
                  <div>
                    <label style={labelStyle}>Section</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.section} onChange={e => set('section', e.target.value)}>
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Guardian Name</label>
                    <input style={inputStyle} value={form.guardianName} onChange={e => set('guardianName', e.target.value)} placeholder="Parent/Guardian" />
                  </div>
                  <div>
                    <label style={labelStyle}>Guardian Phone</label>
                    <input style={inputStyle} value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} placeholder="+92 300 0000000" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    flex: 1, padding: '0.875rem',
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '10px', color: '#818cf8',
                    fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}>
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button type="submit" disabled={loading} style={{
                    flex: 2, padding: '0.875rem',
                    background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '10px', color: 'white',
                    fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p style={{ color: '#64748b', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;