import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserPlus, BookOpen,
  ClipboardList, BarChart2, LogOut, Menu, X, GraduationCap, Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', roles: ['admin', 'teacher', 'student'] },
    { to: '/students', icon: <Users size={18} />, label: 'Students', roles: ['admin', 'teacher'] },
    { to: '/students/add', icon: <UserPlus size={18} />, label: 'Add Student', roles: ['admin', 'teacher'] },
    { to: '/subjects', icon: <BookOpen size={18} />, label: 'Subjects', roles: ['admin', 'teacher', 'student'] },
    { to: '/attendance', icon: <ClipboardList size={18} />, label: 'Attendance', roles: ['admin', 'teacher', 'student'] },
    { to: '/marks', icon: <BarChart2 size={18} />, label: 'Marks & Grades', roles: ['admin', 'teacher', 'student'] },
    { to: '/users', icon: <Shield size={18} />, label: 'Manage Users', roles: ['admin'] },
  ];

  const filtered = links.filter(l => l.roles.includes(user?.role));
  const roleColors = { admin: '#ef4444', teacher: '#3b82f6', student: '#10b981' };
  const roleColor = roleColors[user?.role] || '#6366f1';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'none',
          position: 'fixed', top: 16, left: 16, zIndex: 50,
          background: '#0f172a', color: 'white',
          border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer'
        }}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0,
        height: '100vh', width: 256,
        background: '#1e293b',
        display: 'flex', flexDirection: 'column',
        zIndex: 40,
        borderRight: '1px solid #334155',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: roleColor, display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'white'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'white' }}>EduManage</h1>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Management System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: roleColor + '33', border: `2px solid ${roleColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: roleColor, fontWeight: 700, fontSize: 15
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'white' }}>{user?.name}</p>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                background: roleColor + '22', color: roleColor,
                fontWeight: 600, textTransform: 'capitalize'
              }}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {filtered.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(true)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                transition: 'all 0.2s',
                background: isActive ? roleColor + '22' : 'transparent',
                color: isActive ? roleColor : '#94a3b8',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #334155' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8, border: 'none',
              background: 'transparent', color: '#94a3b8',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = '#ef444420'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;