const { Router } = require("express");
const fetchUser = require("../../middleware/fetchUser");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multer = require("multer");
const router = Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../../middleware/auth");
const {
  countTotalApplications,
  countShortlistedApplications,
  allApplicants,
  allShortlistedApplications,
} = require("../../controllers/adminController");

router
  .route("/admin/all-applicants")
  .get(isAuthenticatedUser, authorizeRoles("admin"), countTotalApplications);
router
  .route("/admin/all-shortlisted-applicants")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    countShortlistedApplications
  );
router
  .route("/admin/all-applicants-list")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allApplicants);
router
  .route("/admin/all-shortlisted-applicants-list")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    allShortlistedApplications
  );

module.exports = router;
