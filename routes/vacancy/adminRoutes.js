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
  getAllData,
  migrateData,
} = require("../../controllers/adminController");

router
  .route("/admin/all-applicants")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    countTotalApplications
  );
router
  .route("/admin/all-shortlisted-applicants")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    countShortlistedApplications
  );
router
  .route("/admin/all-applicants-list/:pageNumber/:pageSize")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    allApplicants
  );
router
  .route("/admin/all-shortlisted-applicants-list/:pageNumber/:pageSize")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    allShortlistedApplications
  );

router
  .route("/admin/applicant-shortlist/:id")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), applicantShortList);

router
  .route("/admin/search")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    search
  );

router
  .route("/admin/get-all-data")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "quad", "helpdesk"),
    getAllData
  );

router
  .route("/admin/migrate-data")
  .get(isAuthenticatedUser, authorizeRoles("admin"), migrateData);

module.exports = router;
