const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      trim: true,
    },
    reviewsPosted: {
      type: [Schema.Types.ObjectId],
      ref: 'review',
    },
    facultyRequests: {
      type: [Schema.Types.ObjectId],
      ref: 'facRequest',
    },
    spamAttempts: {
      type: Number,
      trim: true,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('student', studentSchema);

module.exports = Student;
