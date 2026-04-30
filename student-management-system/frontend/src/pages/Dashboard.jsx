import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Users, BookOpen, BarChart2, ClipboardList, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem',
    border: `1px solid ${color}33`, flex: 1, minWidth: '200px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>{label}</p>
        <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, margin: '0.25rem 0 0' }}>{value}</h3>
        {sub && <p style={{ color, fontSize: '0.8rem', margin: '0.25rem 0 0' }}>{sub}</p>}
      </div>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, subjects: 0, present: 0, avgGrade: 0 });
  const [gradeData, setGradeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, subjectsRes, marksRes, attendanceRes] = await Promise.all([
          api.get('/students?limit=1000'),
          api.get('/subjects'),
          api.get('/marks'),
          api.get('/attendance'),
        ]);

        const students = studentsRes.data.total || 0;
        const subjects = subjectsRes.data.length || 0;
        const marks = marksRes.data || [];
        const attendance = attendanceRes.data || [];

        // Grade distribution
        const gradeCounts = {};
        marks.forEach(m => { gradeCounts[m.grade] = (gradeCounts[m.grade] || 0) + 1; });
        setGradeData(Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count })));

        // Attendance summary
        const present = attendance.filter(a => a.status === 'Present').length;
        const absent = attendance.filter(a => a.status === 'Absent').length;
        const late = attendance.filter(a => a.status === 'Late').length;
        setAttendanceData([
          { name: 'Present', value: present, color: '#10b981' },
          { name: 'Absent', value: absent, color: '#ef4444' },
          { name: 'Late', value: late, color: '#f59e0b' },
        ]);

        const avgGrade = marks.length
          ? (marks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / marks.length).toFixed(1)
          : 0;

        setStats({ students, subjects, present, avgGrade });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard icon={<Users size={22} />} label="Total Students" value={stats.students} color="#6366f1" sub="Registered" />
        <StatCard icon={<BookOpen size={22} />} label="Subjects" value={stats.subjects} color="#3b82f6" sub="Active" />
        <StatCard icon={<ClipboardList size={22} />} label="Present Today" value={stats.present} color="#10b981" sub="Attendance records" />
        <StatCard icon={<Award size={22} />} label="Avg. Score" value={`${stats.avgGrade}%`} color="#f59e0b" sub="Overall performance" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Grade Distribution */}
        <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 style={{ color: 'white', margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>
            <TrendingUp size={18} style={{ display: 'inline', marginRight: '0.5rem', color: '#6366f1' }} />
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="grade" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: 'white' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Pie */}
        <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 style={{ color: 'white', margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>
            <ClipboardList size={18} style={{ display: 'inline', marginRight: '0.5rem', color: '#6366f1' }} />
            Attendance Overview
          </h3>
          {attendanceData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={attendanceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {attendanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                {attendanceData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              No attendance data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;