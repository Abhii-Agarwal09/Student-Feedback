const mongoose = require('mongoose');
const { Schema } = mongoose;

const parametersModel = new Schema(
  {
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
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'faculty',
    },
  },
  { timestamps: true }
);

const Parameters = mongoose.model('parameter', parametersModel);

module.exports = Parameters;
