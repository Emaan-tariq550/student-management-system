const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const { protect, teacherOrAdmin } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { student, subject, examType } = req.query;
    const query = {};
    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (examType) query.examType = examType;

    if (req.user.role === 'student') {
      const Student = require('../models/Student');
      const studentDoc = await Student.findOne({ user: req.user._id });
      if (studentDoc) query.student = studentDoc._id;
    }

    const marks = await Mark.find(query)
      .populate('student', 'name rollNumber')
      .populate('subject', 'name code')
      .populate('enteredBy', 'name')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const mark = await Mark.create({ ...req.body, enteredBy: req.user._id });
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mark deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET performance summary for student
router.get('/summary/:studentId', protect, async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId }).populate('subject', 'name');
    const summary = marks.map(m => ({
      subject: m.subject?.name,
      examType: m.examType,
      marks: m.marks,
      totalMarks: m.totalMarks,
      grade: m.grade,
      percentage: ((m.marks / m.totalMarks) * 100).toFixed(1)
    }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;