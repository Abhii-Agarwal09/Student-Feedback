const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'faculty',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'student',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    parameters: {
      type: Schema.Types.ObjectId,
      ref: 'parameter',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  },
  { timestamps: true }
);

// reviewSchema.pre('remove', function (next) {
//   console.log('inside review delete pre middleware');
//   const review = this;
//   review.model('parameter').remove({ _id: review.parameters }, next);
//   next();
// });

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
