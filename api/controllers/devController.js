const Student = require('../models/studentModel.js');
const Faculty = require('../models/facultyModel.js');
const Comment = require('../models/commentModel.js');
const Review = require('../models/reviewModel.js');
// const Course = require('../models/courseModel.js');
const Parameters = require('../models/parametersModel.js');

const { postReviewOld } = require('../../utilities/index');

// console.log(postReviewOld);

module.exports = { postReviewOld };

module.exports.getAllStudents = async (req, res, next) => {
  const students = await Student.find();
  res.json({ students });
};

module.exports.createStudent = async (req, res, next) => {
  const { name, email } = req.body;
  const student = new Student({ name, email });
  await student.save();
  res.json({
    success: true,
    message: 'Student created successfully:',
    student,
  });
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId } = req.body;
  const review = await Review.findById(reviewId);
  const parameterId = review.parameters;
  const commentId = review.comment;

  const facultyId = review.faculty;
  const faculty = await Faculty.findById(facultyId);
  faculty.comments.filter((cid) => cid !== commentId);
  faculty.comments.filter((rid) => rid !== reviewId);

  await faculty.save();

  await Parameters.deleteOne({ _id: parameterId });
  await Comment.deleteOne({ _id: commentId });
  await Review.deleteOne({ _id: reviewId });
  res.json({ success: true, message: 'Review deleted' });
};

module.exports.getReview = async (req, res) => {};

module.exports.createReview = async (req, res) => {};