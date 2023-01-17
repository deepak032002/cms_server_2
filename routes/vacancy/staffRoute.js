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
  registerUser,
  loginUser,
  getUser,
  staffForm,
  getform,
  staffFormUpdate,
  forgetPassword,
  resetPassword,
} = require("../../controllers/staffController");
const reqhandler = require("../../requesHandler");
const reshandler = require("../../responseHandler");
const passwordHash = require("../../middleware/passwordHash");
const upload = multer();

// Signup Staff
router.post("/register", passwordHash, registerUser);
// Login Staff
router.post("/login", loginUser);
// Get Staff
router.get("/getuser", fetchUser, getUser);

// Create Staff Forms
router.post(
  "/form",
  upload.single("personal_details[image]"),
  fetchUser,
  staffForm
);

router.put(
  "/form",
  upload.single("personal_details[image]"),
  fetchUser,
  staffFormUpdate
);

// Get User Form
router.get("/form", fetchUser, getform);

//
// router.get("/encrypt", encryptData);
router.post("/paymentInitiator", fetchUser, reqhandler.postReq);
router.post("/paymentResponse", reshandler.postRes);

router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
