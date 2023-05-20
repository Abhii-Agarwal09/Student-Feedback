const Student = require('../models/studentModel.js');
const { createAccessToken } = require('../middleware/auth');

// Function to create a new student on login, and login any existing student
const createAndLoginStudent = async (req, res, next) => {
  try {
    // Extract student id from request body
    const { studentId } = req.body;
    console.log('Student id in login student function', studentId);
    // Create new student if student id is undefined, else login the student
    if (studentId === undefined) {
      // Extract name and email from request body
      const { displayName, email } = req.body;
      // Create a new student
      const ifStudent = await Student.findOne({ name: displayName, email });
      if (ifStudent) {
        if (ifStudent.isBanned === true) {
          return res.json({
            success: false,
            message:
              'You are banned from this website because of too many spam comments',
          });
        }
        const token = createAccessToken({ studentId: ifStudent._id });
        return res.json({
          success: true,
          message: 'Student logged in',
          token: token,
          data: ifStudent,
        });
      } else if (displayName.length === 0 || email.length === 0) {
        return res.json({
          success: false,
          message: 'Name or email is required',
        });
      } else {
        const student = new Student({ name: displayName, email });
        await student.save();
        // Create access token for student
        const token = createAccessToken({ studentId: student._id });
        // Send the response
        return res.json({
          success: true,
          message: 'New student created',
          data: student,
          token,
        });
      }
    } else {
      // Find student in the db
      const student = await Student.findById(studentId);
      // If student found, generate token and send response
      if (!student) {
        return res.json({
          success: false,
          message: 'Student not found',
        });
      }
      if (student.isBanned === true) {
        return res.json({
          success: false,
          message:
            'You are banned from this website because of too many spam comments',
        });
      }
      // Generate token
      const token = createAccessToken({ studentId: student._id });
      // Send the response
      return res.json({
        success: true,
        message: 'Student logged in successfully',
        token,
        data: student,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const showLoginPage = (req, res) => {
  res.json({ success: true, message: 'Login page' });
};

module.exports = { createAndLoginStudent, showLoginPage };
