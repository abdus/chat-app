const jwt = require('jsonwebtoken');
const jwtSecret = require('../config').jwtSecret;

const generateJWT = userID => {
  return jwt.sign(userID, jwtSecret);
};

const decodeToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};

module.exports = {
  generateJWT,
  decodeToken,
};
