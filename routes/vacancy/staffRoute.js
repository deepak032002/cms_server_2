const { Router } = require("express");
const staffSchemaValidate = require("../../middleware/staffValidation");
const { StaffForm } = require("../../model/staff/staffModel");
const fetchUser = require("../../middleware/fetchUser");
const streamUpload = require("../../middleware/uploadImage");
const cloudinary = require("cloudinary").v2;
const uniqueId = require("uniqid");
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
} = require("../../controllers/staffController");
const passwordHash = require("../../middleware/passwordHash");
const upload = multer();

// Get Staff
router.get("/", (req, res) => {
  try {
    const { error } = staffSchemaValidate.validate(req.body);
    if (error) {
      res.json({ error: error.details, success: false });
    } else {
      const data = StaffForm(req.body);
      if (data) {
        data.save();
        res.json({ msg: "Created Successfully", success: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Create Staff
router.post(
  "/form",
  upload.single("personal_details[image]"),
  fetchUser,
  async (req, res) => {
    try {
      const image = await streamUpload(req);
      req.body.personal_details.image = image.secure_url;
      req.body.registrationNum = `ONL/MAR23/${uniqueId.time()}`;
      req.body.userId = req.user;

      const { error } = staffSchemaValidate.validate(req.body);

      if (error) {
        return res.json({ error: error.details, success: false });
      }
      const data = StaffForm(req.body);
      if (data) {
        data.save();
        return res.json({ msg: "Created Successfully", success: true });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Signup Staff
router.post("/register", passwordHash, registerUser);
// Login Staff
router.post("/login", loginUser);
// Get Staff
router.post("/getuser", fetchUser, getUser);

module.exports = router;
