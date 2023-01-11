const bcrypt = require("bcrypt");
const uniqueId = require("uniqid");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "jkashiwesahbjhbjsax6w6w69dwdwwwc3sa6";
const staffSchemaValidate = require("../middleware/staffValidation");
const { Staff, StaffForm } = require("../model/staff/staffModel");
const streamUpload = require("../middleware/uploadImage");

exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res
      .status(400)
      .json({ success: false, message: "please send all the fields" });
  }

  const isRegisterEmail = await Staff.findOne({ email: email });
  if (isRegisterEmail) {
    return res
      .status(409)
      .json({ success: false, message: "email already registered!" });
  }

  const staff = await new Staff({
    name,
    email,
    password,
  });
  console.log(staff);
  if (staff) {
    staff.save();
    return res
      .status(201)
      .json({ success: true, message: "Successfully created" });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "please fill all the data" });
    }

    const isGetEmail = await Staff.findOne({ email: email });
    if (!isGetEmail) {
      return res.status(409).json({
        success: false,
        message: "please login with correct credentials",
      });
    }

    const isPasswordMatch = bcrypt.compare(password, isGetEmail.password);

    if (!isPasswordMatch) {
      return res.status(409).json({
        authtoken: null,
        msg: "Please login with correct credentials",
        signal: false,
      });
    }

    const data = {
      userId: isGetEmail._id,
    };

    const token = jwt.sign(data, JWT_SECRET);

    res.status(200).json({ token, msg: "Login Succesfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = await req.user;
    const user = await Staff.findById(userId).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.staffForm = async (req, res) => {
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
      return res.status(201).json({ msg: "Created Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.staffFormUpdate = async (req, res) => {
  try {
    if (typeof req.body.personal_details.image !== "string") {
      const image = await streamUpload(req);
      req.body.personal_details.image = image.secure_url;
    }

    const { error } = staffSchemaValidate.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details, success: false });
    }
    const data = StaffForm.findOneAndUpdate({ userId: req.user }, req.body);

    if (data) {
      return res
        .status(200)
        .json({ msg: "Update Successfully", success: true });
    }

    return res.status(404).send("User Not Valid!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getform = async (req, res) => {
  try {
    const userForm = await StaffForm.findOne({ userId: req.user });

    if (userForm) {
      return res.status(200).json({ form: userForm, success: true });
    }
    return res.status(404).send("Form Not Found!");
  } catch (error) {
    return res.status(500).send(error);
  }
};

// exports.encryptData = (req, res) => {
//   try {
//     ccavenue.setMerchant("1918298");
//     ccavenue.setWorkingKey("BD81D9FE1E0C9E2E624FB70E89F01C90");
//     ccavenue.setOrderId(uniqueId());
//     ccavenue.setRedirectUrl("http://careers.cmsitportal.org:3000/payment");
//     ccavenue.setOrderAmount("500");
//     ccavenue.makePayment(res);

//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };
