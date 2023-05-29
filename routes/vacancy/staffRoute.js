const { Router } = require("express");
const fetchUser = require("../../middleware/fetchUser");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
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

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cms",
  },
});
const upload = multer({ storage: storage });

// Signup Staff
router.post("/register", passwordHash, registerUser);
// Login Staff
router.post("/login", loginUser);
// Get Staff
router.get("/getuser", fetchUser, getUser);

// Create Staff Forms
router.post(
  "/form",
  fetchUser,
  upload.single("personal_details[image]"),
  staffForm
);

router.patch(
  "/form",
  fetchUser,
  upload.single("personal_details[image]"),
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
