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
  applicantShortList,
  search,
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

router
  .route("/admin/applicant-shortlist/:id")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), applicantShortList);

router
  .route("/admin/search")
  .post(isAuthenticatedUser, authorizeRoles("admin"), search);


module.exports = router;
