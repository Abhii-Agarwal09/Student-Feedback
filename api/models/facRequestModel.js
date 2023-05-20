const mongoose = require('mongoose');
const { Schema } = mongoose;

const facRequestSchema = new Schema(
  {
    courseName: { type: String, uppercase: true },
    courseCode: { type: String, uppercase: true },
    facultyName: { type: String, uppercase: true },
    facultySchool: { type: String, uppercase: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'student' },
  },
  { timestamps: true }
);

const FacRequest = mongoose.model('facRequest', facRequestSchema);

module.exports = FacRequest;
