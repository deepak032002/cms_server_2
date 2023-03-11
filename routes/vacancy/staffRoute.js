const { Router } = require("express");
const fetchUser = require("../../middleware/fetchUser");
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
  verifyEmail,
  // confirmOrder,
  resendEmailOtp,
  isVerifyEmail,
  // paymentInitiator,
  // verifyPayment,
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

router.patch(
  "/form",
  upload.single("personal_details[image]"),
  fetchUser,
  staffFormUpdate
);

// Get User Form
router.get("/form", fetchUser, getform);

// router.get("/encrypt", encryptData);
router.post("/paymentInitiator", fetchUser, reqhandler.postReq);
router.post("/paymentResponse", reshandler.postRes);

// router.get("/paymentInitiator", fetchUser, paymentInitiator);
// router.post("/paymentVerify", verifyPayment);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.get("/isverify-email", fetchUser, isVerifyEmail);
router.post("/resend-email", resendEmailOtp);

module.exports = router;
