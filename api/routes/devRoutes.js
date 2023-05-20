const express = require('express');
const {
  getAllStudents,
  createStudent,
  getReview,
  createReview,
  deleteReview,
  postReviewOld,
} = require('../controllers/devController.js');

const devRouter = express.Router();

devRouter.route('/students').get(getAllStudents).post(createStudent);
devRouter
  .route('/reviews')
  .get(getReview)
  .post(createReview)
  .delete(deleteReview);

const facultyRatings = require('../../utilities/faculty-ratings');
const Course = require('../models/courseModel.js');
const Parameters = require('../models/parametersModel.js');
const Faculty = require('../models/facultyModel.js');
const Review = require('../models/reviewModel.js');
const Comment = require('../models/commentModel.js');

const comments = require('../../utilities/new-comments');
const axios = require('axios');
const newFacultyRatings = facultyRatings.map((facultyRating) => {
  return {
    ...facultyRating,
    leniency: 0,
    lab: 0,
    internalAssessments: 0,
  };
});

// console.log(newFacultyRatings);
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

devRouter.route('/reviews/old').get(async (req, res) => {
  // console.log(postReviewOld);
  try {
    for (let i = 0; i < newFacultyRatings.length; i++) {
      // setTimeout(async () => {
      //   await postReviewOld(newFacultyRatings[i]);
      //   console.log('Posting review: ', i + 1);
      // }, 5000);
      await postReviewOld(newFacultyRatings[i]);
      console.log('Posted review: ', i + 1);
      timeout(5000);
    }
    // newFacultyRatings.forEach((facultyRating) => {
    //   console.log('Inside for each loop');
    //   postReviewOld(facultyRating);
    // });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

devRouter.route('/delete').delete(async (req, res) => {
  // await Course.deleteMany();
  // await Parameters.deleteMany();
  // await Faculty.deleteMany();
  // await Review.deleteMany();
  await Comment.deleteMany();
  res.json({ success: true });
});

devRouter.route('/auto').get(async (req, res) => {
  let dataArr = [];
  let courses = await Course.find().populate('faculties');

  let newCourses = [];
  courses.forEach((course) => {
    let newCourse = course.toObject();
    newCourses.push(newCourse);
  });

  console.log(newCourses.length);

  newCourses.forEach((course) => {
    let courseCode = course.courseCode;
    let courseName = course.courseName;
    course.faculties.forEach((faculty) => {
      let facultyName = faculty.name;
      let school = faculty.school;

      const str = `${courseCode}-${courseName}-${facultyName}-${school}`;

      dataArr.push(str);
    });
  });
  console.log(dataArr.length);
  res.json({ success: true, dataArr });
});

devRouter.route('/comments').get(async (req, res) => {
  console.log(comments.length);

  for (let i = 2432; i < comments.length; i++) {
    // let { name, text } = comments[i];
    let name = comments[i].name;
    let text = comments[i].comments;
    const faculty = await Faculty.findOne({ name });
    if (!faculty) {
      continue;
    }
    const isSpam = await axios.post(
      'https://spam-filtering-comments.herokuapp.com/checkStatus',
      { comment: text }
    );
    console.log(i + 1, isSpam.data.status);
    if (isSpam.data.status === true) {
      continue;
    } else {
      const comment = new Comment({
        courseCode: '',
        comment: text,
        faculty: faculty._id,
      });
      await comment.save();
      faculty.comments.push(comment._id);
      await faculty.save();
    }
    timeout(5000);
  }
  res.json({ success: true });
});

module.exports = devRouter;
