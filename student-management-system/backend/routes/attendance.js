const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, teacherOrAdmin } = require('../middleware/auth');

// GET all attendance (with filters)
router.get('/', protect, async (req, res) => {
  try {
    const { student, subject, date, startDate, endDate } = req.query;
    const query = {};
    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (date) query.date = new Date(date);
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    // Students only see their own
    if (req.user.role === 'student') {
      const Student = require('../models/Student');
      const studentDoc = await Student.findOne({ user: req.user._id });
      if (studentDoc) query.student = studentDoc._id;
    }

    const records = await Attendance.find(query)
      .populate('student', 'name rollNumber')
      .populate('subject', 'name code')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark attendance
router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { student, subject, date, status } = req.body;
    // Upsert: update if already marked that day
    const record = await Attendance.findOneAndUpdate(
      { student, subject, date: new Date(date) },
      { student, subject, date: new Date(date), status, markedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST bulk attendance
router.post('/bulk', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { records } = req.body; // array of { student, subject, date, status }
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.student, subject: r.subject, date: new Date(r.date) },
        update: { ...r, date: new Date(r.date), markedBy: req.user._id },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(ops);
    res.json({ message: 'Attendance saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET attendance summary for a student
router.get('/summary/:studentId', protect, async (req, res) => {
  try {
    const total = await Attendance.countDocuments({ student: req.params.studentId });
    const present = await Attendance.countDocuments({ student: req.params.studentId, status: 'Present' });
    const absent = await Attendance.countDocuments({ student: req.params.studentId, status: 'Absent' });
    const late = await Attendance.countDocuments({ student: req.params.studentId, status: 'Late' });
    res.json({ total, present, absent, late, percentage: total ? ((present / total) * 100).toFixed(1) : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;