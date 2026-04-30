const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examType: { type: String, enum: ['Quiz', 'Midterm', 'Final', 'Assignment'], required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String, default: '' },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-calculate grade before saving
markSchema.pre('save', function(next) {
  const percentage = (this.marks / this.totalMarks) * 100;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'C';
  else if (percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Mark', markSchema);