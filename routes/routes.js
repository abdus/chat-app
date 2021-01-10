const r = require("express").Router();
const { messageSchema, userSchema } = require("../db");
const roomRoute = require("./rooms");
const {
  isLoggedIn,
  handleSignUp,
  handleSignIn,
} = require("../controller/auth.controller");

/** GET: HOMEPAGE */
r.get("/", isLoggedIn, (req, res) => {
  console.log(req.auth);
  if (req.auth.code === 100) return res.redirect("/room/general");
  else res.render("index", { layout: "index" });
});

/** POST: Sign In */
r.post("/signin", handleSignIn, (req, res) => {
  res.send(req.handleSignIn);
});

/** POST: Sign up */
r.post("/signup", handleSignUp, (req, res) => {
  res.send(req.handleSignup);
});

/** GET: Chat Messages */
r.get("/messages/:room", (req, res) => {
  messageSchema
    .find({ chatRoom: req.params.room })
    .sort({ time: 1 })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

/** GET: Logout */
r.get("/logout", (req, res) => {
  req.auth = {
    code: 401,
    message: "Unauthorized",
    userID: null,
  };
  res.clearCookie("jwt");
  return res.redirect("/");
});

/** GET: Email Verify */
r.get("/verify/:token", (req, res) => {
  userSchema
    .findOne({ emailVerificationToken: req.params.token })
    .exec()
    .then((user) => {
      if (!user || user.length === 0) {
        return res.render("emailVerification", {
          message: "No User Found With This Token",
          code: "404",
          layout: "emailVerified",
          token: req.params.token,
        });
      } else {
        user.isEmailVerified = true;
        user.emailVerificationToken = "";
        user.save();

        return res.render("emailVerification", {
          message: "User Verified",
          code: 100,
          layout: "emailVerified",
          token: req.params.token,
        });
      }
    });
});

r.use("/room", isLoggedIn, roomRoute);

// exports
module.exports = r;
