module.exports = {
  jwtSecret:
    process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'shhhhhhh',
};
