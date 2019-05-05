const parseJWT = cookie => {
  return cookie.jwt ? cookie.jwt : null;

  // if (!authHeader) return '';
  // return authHeader.split('Bearer')[1] ? authHeader.split('Bearer')[1] : '';
};

module.exports = {
  parseJWT,
};
