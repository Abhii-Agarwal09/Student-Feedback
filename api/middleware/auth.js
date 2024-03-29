const jwt = require('jsonwebtoken');

module.exports.createAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

module.exports.isLoggedIn = (req, res, next) => {
  // console.log('REQUEST HEADERS:', req.headers);
  const jwtToken = req.headers.authorization.split(' ')[1];
  console.log('JWT TOKEN', jwtToken);
  if (jwtToken !== 'null') {
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, data) => {
      console.log('TOKEN DATA', data);
      // if token expire or incorrect token
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          invalidToken: true,
          message: 'Invalid token, please login again!',
        });
      }
      req.body.studentId = data.studentId;
      next();
    });
  } else {
    req.body.studentId = undefined;
    next();
  }
};
