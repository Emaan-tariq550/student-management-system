const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const { protect, adminOnly, teacherOrAdmin } = require('../middleware/auth');

// Multer setup for profile images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/students - Get all students (with search, pagination)
router.get('/', protect, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, class: cls, section } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (cls) query.class = cls;
    if (section) query.section = section;

    // If student role, only show their own profile
    if (req.user.role === 'student') {
      query.user = req.user._id;
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('user', 'email role')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'email role');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students - Add student (admin/teacher)
router.post('/', protect, teacherOrAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.profileImage = `/uploads/${req.file.filename}`;
    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', protect, teacherOrAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.profileImage = `/uploads/${req.file.filename}`;
    const student = await Student.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;