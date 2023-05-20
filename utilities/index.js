// const connectDB = require('../config/db');
// connectDB();

const Course = require('../api/models/courseModel');
const Faculty = require('../api/models/facultyModel');
const Parameters = require('../api/models/parametersModel');
const Review = require('../api/models/reviewModel');
const facultyRatings = require('./faculty-ratings.js');

// console.log(facultyRatings);

const newFacultyRatings = facultyRatings.map((facultyRating) => {
  return {
    ...facultyRating,
    _id: undefined,
    overall: undefined,
    nor: undefined,
    facultySchool: undefined,
    friendly: undefined,
    school: facultyRating.school,
    leniency: 0,
    friendliness: facultyRating.friendly,
    lab: 0,
    internalAssessments: 0,
  };
});

// console.log(newFacultyRatings);

const postReviewOld = async (facultyRating) => {
  try {
    console.log('Inside post review old function');
    const {
      facultyName,
      school,
      courseCode,
      courseName,
      friendliness,
      teaching,
      notes,
      leniency,
      lab,
      internalAssessments,
    } = facultyRating;

    console.log(
      facultyName,
      school,
      courseCode,
      courseName,
      typeof leniency,
      typeof teaching,
      typeof notes,
      typeof friendliness,
      typeof lab,
      typeof internalAssessments
    );

    let faculty = await Faculty.findOne({
      name: facultyName,
      school: school,
    });
    // console.log(faculty);
    let course = await Course.findOne({ courseCode, courseName });
    // console.log(course);

    if (!faculty || !course) {
      if (!faculty) {
        faculty = new Faculty({
          name: facultyName,
          school,
        });
      }
      if (!course) {
        course = new Course({
          courseCode,
          courseName,
        });
      }
      faculty.courses.push(course._id);
      course.faculties.push(faculty._id);
      await faculty.save();
      await course.save();
    }

    if (!faculty.courses.includes(course._id)) {
      faculty.courses.push(course._id);
      await faculty.save();
    }
    if (!course.faculties.includes(faculty._id)) {
      course.faculties.push(faculty._id);
      await course.save();
    }

    const newParameters = new Parameters({
      faculty: faculty._id,
      leniency: facultyRating.leniency,
      teaching: facultyRating.teaching,
      notes: facultyRating.notes,
      friendliness: facultyRating.friendliness,
      lab: facultyRating.lab,
      internalAssessments: facultyRating.internalAssessments,
    });
    await newParameters.save();

    const review = new Review({
      faculty: faculty._id,
      course,
      isApproved: true,
      parameters: newParameters,
    });
    await review.save();

    faculty.reviews.push(review._id);
    faculty.nor += 1;

    faculty.leniency =
      faculty.leniency === 0
        ? (faculty.leniency += facultyRating.leniency)
        : (faculty.leniency + facultyRating.leniency) / 2;
    // Teaching
    faculty.teaching =
      faculty.teaching === 0
        ? (faculty.teaching += facultyRating.teaching)
        : (faculty.teaching + facultyRating.teaching) / 2;
    // Notes
    faculty.notes =
      faculty.notes === 0
        ? (faculty.notes += facultyRating.notes)
        : (faculty.notes + facultyRating.notes) / 2;
    // Friendliness
    faculty.friendliness =
      faculty.friendliness === 0
        ? (faculty.friendliness += facultyRating.friendliness)
        : (faculty.friendliness + facultyRating.friendliness) / 2;
    // Lab
    faculty.lab =
      faculty.lab === 0
        ? (faculty.lab += facultyRating.lab)
        : (faculty.lab + facultyRating.lab) / 2;
    // Internal Assessments
    faculty.internalAssessments =
      faculty.internalAssessments === 0
        ? (faculty.internalAssessments += facultyRating.internalAssessments)
        : (faculty.internalAssessments + facultyRating.internalAssessments) / 2;

    // Update overall rating
    faculty.overallRating =
      (faculty.leniency +
        faculty.notes +
        faculty.teaching +
        faculty.friendliness +
        faculty.lab +
        faculty.internalAssessments) /
      6;

    await faculty.save();
  } catch (err) {
    console.log(err);
  }
};

// console.log(newFacultyRatings);

module.exports = { postReviewOld };
