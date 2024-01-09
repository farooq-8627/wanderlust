const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

// const listingController = require("../controllers/listings.js");
const {
  indexRoute,
  showListing,
  renderCreateFile,
  createListing,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(indexRoute))
  .post(
    isLoggedIn,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );

router.get("/new", isLoggedIn, renderCreateFile);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

module.exports = router;
