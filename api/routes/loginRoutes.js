const express = require('express');
const {
  createAndLoginStudent,
  showLoginPage,
} = require('../controllers/loginController.js');

const loginRouter = express.Router();

loginRouter.route('/').get(showLoginPage).post(createAndLoginStudent);

module.exports = loginRouter;
