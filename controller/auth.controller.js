const { userSchema } = require("../db");
const { decodeToken, generateJWT } = require("../auth/jwt.auth");
const { parseJWT } = require("../utils/helpers");
const sendMail = require("../lib/sendMail");
const { uploadImage } = require("../utils/helpers");

/**
 * This middleware checks if a user is loggedin or not.
 * Then it attach a property `auth` in `req` object which could be used in a later stage
 * @param {*} req - Express req
 * @param {*} res - Express res
 * @param {*} next - Express next
 */
const isLoggedIn = (req, res, next) => {
  decodeToken(parseJWT(req.cookies))
    .then((data) => {
      userSchema
        .findById(data.id)
        .then((user) => {
          if (!user) {
            // If there is no user available with the ID(nearly impossible case)
            req.auth = {
              code: 401,
              message: "User Not Found",
              userID: null,
            };

            return next();
          } else {
            // User is logged-in
            req.auth = {
              code: 100,
              message: "User is Logged In",
              userID: data.id,
            };

            return next();
          }
        })
        .catch((e) => {
          // If there is any error related to database
          req.auth = {
            code: 500,
            message: e.message,
            userID: null,
          };

          return next();
        });
    })
    .catch((e) => {
      req.auth = {
        code: 401,
        message:
          e.name === "TokenExpiredError"
            ? "Token Expired"
            : e.name === "JsonWebTokenError"
            ? e.message
            : "JWT Not Activated",
        userID: null,
      };

      return next();
    });
};

/**
 * This middleware handles the signup process.
 * It, then, attech `handleSignup` pro
 * @param {*} req - Express req
 * @param {*} res - Express res
 * @param {*} next - Express next
 */
const handleSignUp = (req, res, next) => {
  const { name, email, password, profileImage } = req.body;

  if (!name || !email || !password) {
    // If email or password or name is missing
    req.handleSignup = {
      code: 400,
      message: `All Fields are Required`,
    };

    return next();
  }
  // Check db and see if the email is already exists
  userSchema
    .find({ email: email })
    .then(async (user) => {
      uploadImage(profileImage, "somename.png");
      if (user.length === 0) {
        // user.length === 0 means there is no user with this email
        new userSchema({
          name: name,
          email: email,
          password: password,
        })
          .save()
          .then((e) => {
            // This will execute only if the data insertion is successful
            // send a email confirmation mail
            sendMail(
              e.email,
              `${process.env.npm_package_homepage}/verify/${e.emailVerificationToken}`
            )
              .catch((err) => console.log(err.message));

            req.handleSignup = {
              code: 100,
              message: "Sign Up successful",
            };

            return next();
          })
          .catch((e) => {
            // Handle databse error
            req.handleSignup = {
              code: 500,
              message: `Failed to insert Data: ${e.message}`,
            };

            return next();
          });
      } else {
        // User already exists
        req.handleSignup = {
          code: 409,
          message: `Conflict: User with Email ${email} already exist`,
        };

        return next();
      }
    })
    .catch((e) => {
      // Handle db query error
      req.handleSignup = {
        code: 500,
        message: `Database Error: ${e.message}`,
      };

      return next();
    });
};

/**
 * This middleware handles sign-in requests
 * @param {*} req - Express req
 * @param {*} res - Express res
 * @param {*} next - Express next
 */
const handleSignIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // If email or password or name is missing
    req.handleSignIn = {
      code: 400,
      message: `Client didn't send all required field`,
      jwt: null,
    };

    return next();
  } else {
    // First, find the user by email
    userSchema
      .findOne({ email: email.toLowerCase() })
      .exec()
      .then((user) => {
        if (!user || user.length === 0) {
          req.handleSignIn = {
            code: 400,
            message: `User Not Found`,
            jwt: null,
          };

          return next();
        }

        // If there is a user, check if the password matches
        user
          .comparePassword(password)
          .then((isMatched) => {
            if (isMatched && user.isEmailVerified) {
              req.handleSignIn = {
                code: 100,
                message: `Password Matched`,
                jwt: generateJWT({ id: user._id }),
              };
              // set cookie
              res.cookie("jwt", req.handleSignIn.jwt, { httpOnly: false });

              return next();
            } else {
              req.handleSignIn = {
                code: 400,
                message: `Wrong Password Or Email isn't Verified Yet!`,
                jwt: null,
              };

              return next();
            }
          })
          .catch((e) => {
            req.handleSignIn = {
              code: 500,
              message: e.message,
              jwt: null,
            };

            return next();
          });
      })
      .catch((e) => {
        req.handleSignIn = {
          code: 500,
          message: e.message,
          jwt: null,
        };

        return next();
      });
  }
};

module.exports = {
  isLoggedIn,
  handleSignUp,
  handleSignIn,
};
