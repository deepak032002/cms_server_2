const bcrypt = require("bcrypt");

const passwordHash = async (req, res, next) => {
  if (req.body.confirm_password !== req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Confirm password is not equal Password",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const genPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = genPass;
  next();
};

module.exports = passwordHash;
