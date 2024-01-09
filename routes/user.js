const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signup,
  login,
  logout,
  renderSignup,
  renderLogin,
} = require("../controllers/users.js");

//Sign Up
router.route("/signup").get(renderSignup).post(wrapasync(signup));

// Login
router
  .route("/login")
  .get(renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapasync(login)
  );

// Logout
router.get("/logout", logout);

module.exports = router;
