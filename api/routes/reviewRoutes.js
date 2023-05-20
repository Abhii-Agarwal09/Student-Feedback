const express = require('express');
const {
  getReview,
  postReview,
  requestFaculty,
  findTopTenFaculty,
} = require('../controllers/reviewController.js');

const reviewRouter = express.Router();

reviewRouter.route('/').get(getReview).post(postReview);
reviewRouter.route('/request').post(requestFaculty);
reviewRouter.route('/top').get(findTopTenFaculty);

module.exports = reviewRouter;
