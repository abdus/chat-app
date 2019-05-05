const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const SALT_ROUNDS = 10;

const generateEmailVerificationToken = () => {
  const random =
    Math.random() * Math.random() + '' + Math.random() * Math.random();
  return Buffer.from(random).toString('base64');
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, required: true, default: false },
    emailVerificationToken: {
      type: String,
      default: generateEmailVerificationToken,
    },
  },
  { autoIndex: false }
);

// Hash password before putting it in database
userSchema.pre('save', function(next) {
  this.email = this.email['toLowerCase'](); // downcase the email

  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  });
});

// Compare two password
userSchema.methods.comparePassword = function(plainTextPass) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainTextPass, this.password, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
};

module.exports = mongoose.model('users', userSchema);
