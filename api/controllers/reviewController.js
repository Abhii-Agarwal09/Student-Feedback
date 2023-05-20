const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const Comment = require('../models/commentModel');
const Review = require('../models/reviewModel');
const Course = require('../models/courseModel');
const Parameters = require('../models/parametersModel');
const FacRequest = require('../models/facRequestModel');

const axios = require('axios');

/** Function to retrieve reviews of a particular teacher
 * Take in faculty name, course code
 * Get all the reviews of that faculty
 * Filter out reviews for that particular course code
 * Send the response
 */
const getReview = async (req, res, next) => {
  try {
    // Check student for authenticated access
    const { studentId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.json({
        success: false,
        message: 'Student not logged in',
      });
    }
    // Find faculty reviews and send response
    const { facultyName, courseCode } = req.query;
    console.log(facultyName, courseCode);
    const facultyReviews = await Faculty.findOne({ name: facultyName })
      .populate('reviews')
      .populate('courses')
      .populate('comments');

    // facultyReviews.comments = facultyReviews.comments.filter(
    //   (comment) => comment.courseCode === courseCode
    // );

    const reviews = facultyReviews.toObject();
    // console.log('reviews: ', reviews);

    const commentsArr = reviews.comments;
    // console.log('old comments: ', commentsArr);

    const alteredComments = commentsArr.map((comment) => {
      return {
        courseCode: comment.courseCode,
        comment: comment.comment,
      };
    });

    // console.log('altered comments: ', alteredComments);

    const newCommentsArr = alteredComments.filter(
      (comment) =>
        comment.courseCode === courseCode || comment.courseCode === ''
    );
    // console.log('new comments: ', newCommentsArr);

    reviews.comments = newCommentsArr;

    const resultData = {
      ...reviews,
      reviews: undefined,
      courses: undefined,
      _id: undefined,
      courseCode,
    };

    // console.log(facultyReviews);
    res.json({
      success: true,
      message: 'All faculty reviews',
      data: resultData,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: 'Error! Cannot get review...',
    });
  }
};

/** Function to post a review for a faculty
 * Get all the parameters for a review in request body
 * Send the comment to flask server for spam Detection
 * If spam, increase spam count, check spam count
 * if spam count >= 3, ban the user, and send the response
 * if not spam
 * create a new review
 * Calculate and update the faculty parameters
 * send the response
 */

// helper function to detect spam in comment

const checkComment = async (comment) => {
  const res = await axios.post(
    'https://spam-filtering-comments.herokuapp.com/checkStatus',
    { comment }
  );
  // console.log(res.data.status, typeof res.data.status);
  return res.data.status;
};

const postReview = async (req, res, next) => {
  try {
    const {
      studentId,
      facultyName,
      school,
      courseCode,
      courseName,
      parameters,
      comment,
    } = req.body;
    // console.log(parameters, typeof parameters);
    // check student for authenticated access
    const student = await Student.findById(studentId);
    if (!student) {
      return res.json({
        success: false,
        message: 'Student not authenticated',
      });
    }

    let faculty = await Faculty.findOne({
      name: facultyName,
      school: school,
    });
    let course = await Course.findOne({ courseCode, courseName });

    // Faculty
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

    // console.log(faculty.courses);
    // console.log(faculty.courses.includes(course._id));
    if (!faculty.courses.includes(course._id)) {
      faculty.courses.push(course._id);
      await faculty.save();
    }
    // console.log(faculty);

    // Course

    // console.log(course);
    // if (!course) {
    //   course = new Course({
    //     courseCode,
    //     courseName,
    //   });
    //   course.faculties.push(faculty._id);
    //   await course.save();
    // }
    // console.log(course.faculties.includes(faculty._id));
    // console.log(course.faculties);
    if (!course.faculties.includes(faculty._id)) {
      course.faculties.push(faculty._id);
      await course.save();
    }
    // console.log(course);
    // TODO Make request for comment spam detection

    const isCommentSpam = await checkComment(comment);
    // console.log("Is comment spam: ", isCommentSpam);
    if (isCommentSpam === true) {
      student.spamAttempts += 1;
      if (student.spamAttempts >= 3) {
        student.isBanned = true;
        await student.save();

        return res.json({
          success: false,
          message:
            'You are banned from this website because of too many spam comments',
        });
      }
      await student.save();
      return res.json({
        success: false,
        message:
          'Review not posted because of foul language in the comment! Kindly refrain from doing so',
      });
    }
    // Comment
    const newComment = new Comment({
      courseCode,
      comment,
      faculty: faculty._id,
    });
    await newComment.save();

    // Parameters
    const newParameters = new Parameters({
      faculty: faculty._id,
      leniency: parameters[0],
      teaching: parameters[1],
      notes: parameters[2],
      friendliness: parameters[3],
      lab: parameters[4],
      internalAssessments: parameters[5],
    });
    await newParameters.save();

    // Review
    const review = new Review({
      faculty: faculty._id,
      postedBy: studentId,
      comment: newComment,
      course,
      isApproved: true,
      parameters: newParameters,
    });
    await review.save();

    // Add review to student
    student.reviewsPosted.push(review._id);
    await student.save();

    // Faculty updation
    faculty.reviews.push(review._id);
    faculty.comments.push(newComment._id);
    faculty.nor += 1;
    // Update faculty parameters
    // Leniency
    faculty.leniency =
      faculty.leniency === 0
        ? (faculty.leniency += parameters[0])
        : (faculty.leniency + parameters[0]) / 2;
    // Teaching
    faculty.teaching =
      faculty.teaching === 0
        ? (faculty.teaching += parameters[1])
        : (faculty.teaching + parameters[1]) / 2;
    // Notes
    faculty.notes =
      faculty.notes === 0
        ? (faculty.notes += parameters[2])
        : (faculty.notes + parameters[2]) / 2;
    // Friendliness
    faculty.friendliness =
      faculty.friendliness === 0
        ? (faculty.friendliness += parameters[3])
        : (faculty.friendliness + parameters[3]) / 2;
    // Lab
    faculty.lab =
      faculty.lab === 0
        ? (faculty.lab += parameters[4])
        : (faculty.lab + parameters[4]) / 2;
    // Internal Assessments
    faculty.internalAssessments =
      faculty.internalAssessments === 0
        ? (faculty.internalAssessments += parameters[5])
        : (faculty.internalAssessments + parameters[5]) / 2;

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
    // Send the response
    res.json({
      success: true,
      message: 'Review Posted Successfully',
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: 'Error! Could not post review...',
    });
  }
};

const createFacultyRequest = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.json({
        success: false,
        message: 'Student not logged in',
      });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.json({
        success: false,
        message: 'Student not found',
      });
    }

    const { courseCode, courseName, facultyName } = req.body;

    // let course = await Course.findOne({ courseCode, courseName });
    // let faculty = await Faculty.findOne({ name: facultyName });

    const facRequest = new FacRequest({ courseCode, courseName, facultyName });
    await facRequest.save();

    res.json({
      success: true,
      message: 'Your request has been submitted',
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Error! Could not post request' });
  }
};

const requestFaculty = async (req, res) => {
  const { studentId, courseName, courseCode, facultyName, facultySchool } =
    req.body;

  if (!studentId) {
    return res.json({
      success: false,
      message: 'Student not logged in',
    });
  }

  const facRequest = new FacRequest({
    courseCode,
    courseName,
    facultyName,
    facultySchool,
    requestedBy: studentId,
  });
  await facRequest.save();

  res.json({
    success: true,
    message: 'Faculty request submitted successfully',
    data: facRequest,
  });
};

// helper function
// program to sort array by property name

const compareOverallRating = (a, b) => {
  return a.overallRating - b.overallRating;
};

const findTopTenFaculty = async (req, res) => {
  // const { studentId } = req.body;

  // if (!studentId) {
  //   return res.json({
  //     success: false,
  //     message: 'Student not logged in',
  //   });
  // }

  const { courseCode, courseName } = req.query;

  let course = await Course.findOne({ courseCode, courseName }).populate(
    'faculties'
  );

  if (!course) {
    return res.json({ success: false, message: 'Course not found!' });
  }

  course = course.toObject();

  const alteredFaculties = course.faculties.map((faculty) => {
    return {
      name: faculty.name,
      school: faculty.school,
      overallRating: faculty.overallRating,
    };
  });
  alteredFaculties.sort(compareOverallRating);
  alteredFaculties.reverse();

  // console.log(alteredFaculties);
  course.faculties = alteredFaculties;

  course = {
    ...course,
    _id: undefined,
    __v: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };

  // console.log(course);

  res.json({
    success: true,
    message: 'Top ten faculties for the cours',
    data: course,
  });
};

// /** Function to edit a review
//  * Check comment for spam detection
//  * if spam, update spam count and count max spam limit
//  * if not spam, update the review
//  * send the response
//  */
// export const updateReview = async (req, res, next) => {};

// /** Function to delete a review
//  * Delete the review
//  * send the response
//  */
// export const deleteReview = async (req, res, next) => {};

module.exports = {
  getReview,
  requestFaculty,
  postReview,
  createFacultyRequest,
  findTopTenFaculty,
};
