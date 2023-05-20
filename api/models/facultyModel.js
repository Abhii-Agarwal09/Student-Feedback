const mongoose = require('mongoose');
const { Schema } = mongoose;

const facultySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
    },
    school: {
      type: String,
      trim: true,
      uppercase: true,
    },
    courses: {
      type: [Schema.Types.ObjectId],
      ref: 'course',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'comment',
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'review',
    },
    leniency: {
      type: Number,
      default: 0,
      trim: true,
    },
    teaching: {
      type: Number,
      default: 0,
      trim: true,
    },
    notes: {
      type: Number,
      default: 0,
      trim: true,
    },
    friendliness: {
      type: Number,
      default: 0,
      trim: true,
    },
    lab: {
      type: Number,
      default: 0,
      trim: true,
    },
    internalAssessments: {
      type: Number,
      default: 0,
      trim: true,
    },
    overallRating: {
      type: Number,
      trim: true,
      default: 0,
    },
    nor: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Faculty = mongoose.model('faculty', facultySchema);

module.exports = Faculty;
