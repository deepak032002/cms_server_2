const { Staff } = require("../model/staff/staffModel");
const bcrypt = require("bcrypt");
const JWT_SECRET =
  process.env.JWT_SECRET || "jkashiwesahbjhbjsax6w6w69dwdwwwc3sa6";
const jwt = require("jsonwebtoken");

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
    
    console.log(JWT_SECRET);
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
