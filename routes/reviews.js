const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const { postReview, destroyReview } = require("../controllers/reviews.js");

// Reviews
// Reviews POST Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(postReview)
);

// Delete Review Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview)
);

module.exports = router;
