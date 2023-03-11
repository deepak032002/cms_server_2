const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const staffSchemaValidate = require("../middleware/staffValidation");
const { Staff, StaffForm } = require("../model/staff/staffModel");
const streamUpload = require("../middleware/uploadImage");
const sendEmail = require("../utils/sendMail");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const orderid = require("order-id")("1918BD81D9FE1EAC9E2E624FB70E89F01C90298");

exports.isVerifyEmail = async (req, res) => {
  try {
    const dbres = await Staff.findById(req.user);

    if (!dbres) {
      return res.status(400).send("Something went wrong!");
    }

    const { verifyEmail } = dbres;

    return res.status(200).send({ verifyEmail });

    // console.log(dbres);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

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
    otp,
  });
  if (staff) {
    staff.save();

    const message = `Your otp for verification is ${otp}`;

    sendEmail({
      email,
      subject: "Email Verification",
      message: message,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully created and Otp send to your email address!",
    });
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

    const isPasswordMatch = await bcrypt.compare(password, isGetEmail.password);

    if (!isPasswordMatch) {
      return res.status(409).json({
        authtoken: null,
        message: "Please login with correct credentials",
        signal: false,
      });
    }

    const data = {
      userId: isGetEmail._id,
    };

    const token = jwt.sign(data, JWT_SECRET);

    res
      .status(200)
      .json({ token, message: "Login Succesfully!", success: true });
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

    req.body.registrationNum = `ONL/MAR23/${
      Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
    }`;
    req.body.userId = req.user;

    const { error } = staffSchemaValidate.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details, success: false });
    }
    const data = StaffForm(req.body);
    if (data) {
      data.save();
      return res
        .status(201)
        .json({ message: "Created Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.staffFormUpdate = async (req, res) => {
  try {
    if (
      req.body.personal_details?.image &&
      typeof req.body.personal_details?.image !== "string"
    ) {
      const image = await streamUpload(req);
      req.body.personal_details.image = image.secure_url;
    }

    // const { error } = staffSchemaValidate.validate(req.body);

    // if (error) {
    //   return res.status(400).json({ error: error.details, success: false });
    // }

    const data = await StaffForm.findOneAndUpdate(
      { userId: req.user },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (data) {
      return res
        .status(200)
        .json({ message: "Update Successfully", success: true, data });
    }

    return res.status(404).send("User Not Valid!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getform = async (req, res) => {
  try {
    const userForm = await StaffForm.findOne({ userId: req.user }).select(
      "-_id -isShortlisted -createdAt -paymentData -orderId -__v"
    );

    if (userForm) {
      return res.status(200).json({ form: userForm, success: true });
    }
    return res.status(404).send("Form Not Found!");
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirm_password } = req.body;
    3;
    if (password !== confirm_password) {
      return res.status(400).send("Password and Confirm Password not matched!");
    }

    const staff = await Staff.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!staff) {
      return res.status(404).send({ error: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the staff's password and reset token
    staff.password = hashedPassword;
    staff.passwordResetToken = null;
    staff.passwordResetExpires = null;
    await staff.save();

    return res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).send({ error: "User not found" });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    staff.passwordResetToken = resetToken;
    staff.passwordResetExpires = Date.now() + 3600000;
    await staff.save();

    const message = `
    Dear User,
      This email is to reset your password
      Your link to reset password - ${process.env.FRONTEND_URL}/reset-password/${resetToken}
    `;

    await sendEmail({
      email,
      subject: "Password Reset Email",
      message: message,
    });

    return res.status(200).send("Reset url send on email please verify.");
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Send required field!");
    }

    const user = await Staff.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    const data = await user.save();

    const message = `Your otp for verification is ${otp}`;

    await sendEmail({
      email,
      subject: "Email Verification",
      message: message,
    });

    return res.status(200).send("Otp send on your Email!");
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await Staff.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found with this email!");
    }

    if (user.otp === otp) {
      user.verifyEmail = true;
      user.otp = null;
      user.save();
      return res.status(200).send("Successful verified your email!");
    }

    return res.status(404).send("Invalid credentials!");
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.paymentInitiator = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: "rzp_test_PaNcpmi3lpquPf",
      key_secret: "ubzSq5WO6nK7QGlYj4od8JZJ",
    });

    const id = orderid.generate();
    let orderId = orderid.getTime(id);

    const options = {
      amount: 60000,
      currency: "INR",
      receipt: `${orderId}`,
      payment_capture: 0,
    };
    const payment = await instance.orders.create(options);

    const data = await StaffForm.findOneAndUpdate(
      { userId: req.user },
      {
        orderId: payment.id,
        $push: { orderList: payment.id },
      }
    );

    return res.status(200).send(payment);
  } catch (error) {}
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", "ubzSq5WO6nK7QGlYj4od8JZJ")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const data = await StaffForm.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentConfirmation: true,
        trackingId: razorpay_payment_id,
        // $push: { paymentData: JSON.parse(payment_status) },
      }
    );

    const message = `
        Dear Candidate,
          Your Payment successfully completed
          Your order-id ${razorpay_order_id} for Registration No. - ${data?.registrationNum}
          We contact you soon!
        `;

    sendEmail({
      email: data?.personal_details?.email,
      subject: "Successfull registration!",
      message: message,
    });
    return res.status(200).json({
      success: true,
      orderId: razorpay_order_id,
      amount: 600,
      msg: "Payment Successfull!",
    });
  } else {
    // Payment failed
    const data = await StaffForm.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentConfirmation: false,
        trackingId: razorpay_payment_id,
      }
    );

    const message = `
        Dear Candidate,
          Your Payment Unsuccessfull
          Your order-id ${razorpay_order_id} for Registration No. - ${data?.registrationNum}
          Please try again
        `;

    sendEmail({
      email: data?.personal_details?.email,
      subject: "Payment Failed!",
      message: message,
    });
    return res.status(400).json({
      msg: "Payment failed!",
      success: false,
      orderId: razorpay_order_id,
      amount: 600,
    });
  }
};

// exports.confirmOrder = async (req, res) => {
//   try {
//     const { orderId, referenceNo } = req.body;

//     if (!orderId || !referenceNo) {
//       return res.status(400).send("Send all required field!");
//     }

//     const access_code = "AVXX94KA47AN39XXNA";
//     const params = { order_no: orderId, reference_no: referenceNo };

//     function encrypt(plainText, key = "BD81D9FE1E0C9E2E624FB70E89F01C90") {
//       const keyHash = crypto.createHash("md5").update(key).digest();
//       const initVector = Buffer.from([
//         0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//         0x0c, 0x0d, 0x0e, 0x0f,
//       ]);
//       const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, initVector);
//       let encrypted = cipher.update(plainText, "utf8", "hex");
//       encrypted += cipher.final("hex");
//       return encrypted;
//     }

//     function decrypt(encryptedText, key = "BD81D9FE1E0C9E2E624FB70E89F01C90") {
//       const keyHash = crypto.createHash("md5").update(key).digest();
//       const initVector = Buffer.from([
//         0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//         0x0c, 0x0d, 0x0e, 0x0f,
//       ]);
//       const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
//       const decipher = crypto.createDecipheriv(
//         "aes-128-cbc",
//         keyHash,
//         initVector
//       );
//       let decrypted = decipher.update(encryptedTextBuffer, "binary", "utf8");
//       decrypted += decipher.final("utf8");
//       return decrypted;
//     }

//     const encReq = encrypt(JSON.stringify(params));

//     const final_data = querystring.stringify({
//       enc_request: encReq,
//       access_code: access_code,
//       command: "orderStatusTracker",
//       request_type: "JSON",
//       response_type: "JSON",
//     });
//     const ccavenue_res = await axios.post(
//       `https://apitest.ccavenue.com/apis/servlet/DoWebTrans`,
//       final_data,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     const info = querystring.parse(ccavenue_res.data);
//     if (info.enc_response) {
//       const payment_status = decrypt(info.enc_response);
//       return res.status(200).send(JSON.parse(payment_status));
//     }
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };
