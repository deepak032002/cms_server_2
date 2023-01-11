const { Router } = require("express");
const fetchUser = require("../../middleware/fetchUser");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dn9mifnsi",
  api_key: process.env.API_KEY || "266232138793352",
  api_secret: process.env.API_SECRET || "4apR0zzXvHGuFCTE-00FpLih7XA",
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
  encryptData,
} = require("../../controllers/staffController");
const reqhandler = require("../../requesHandler");

const passwordHash = require("../../middleware/passwordHash");
const upload = multer();

// Signup Staff
router.post("/register", passwordHash, registerUser);
// Login Staff
router.post("/login", loginUser);
// Get Staff
router.post("/getuser", fetchUser, getUser);

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
router.post("/paymentInitiator", reqhandler.postReq);

module.exports = router;
