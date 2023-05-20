const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      trime: true,
      uppercase: true,
    },
    faculties: {
      type: [Schema.Types.ObjectId],
      ref: 'faculty',
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('course', courseSchema);

module.exports = Course;
