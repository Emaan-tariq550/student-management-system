const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // linked user account
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
  profileImage: { type: String, default: '' },
  dateOfBirth: { type: Date },
  admissionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);