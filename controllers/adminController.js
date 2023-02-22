const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/staff/userModel");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const { StaffForm } = require("../model/staff/staffModel");

exports.countTotalApplications = catchAsyncErrors(async (req, res, next) => {
  const allAplications = await StaffForm.count();
  res.status(200).json({
    success: true,
    allAplications,
    message: "Count Success",
  });
});

exports.countShortlistedApplications = catchAsyncErrors(
  async (req, res, next) => {
    const shortlistedAplications = await StaffForm.count({
      isShortlisted: true,
    });
    res.status(200).json({
      success: true,
      shortlistedAplications,
      message: "Count Success",
    });
  }
);

exports.allApplicants = catchAsyncErrors(async (req, res, next) => {
  const allApplicants = await StaffForm.find();
  res.status(200).json({
    success: true,
    data: allApplicants,
    message: "All Applicants",
  });
});
exports.allShortlistedApplications = catchAsyncErrors(
  async (req, res, next) => {
    const allShortlistedApplications = await StaffForm.find({
      isShortlisted: true,
    });
    res.status(200).json({
      success: true,
      data: allShortlistedApplications,
      message: "All Shortlisted Applicants",
    });
  }
);

exports.applicantShortList = catchAsyncErrors(async (req, res, next) => {
  const form = await StaffForm.findById(req.params.id);

  if (!form) {
    return next(new ErrorHander("Form Not Found!", 404));
  }
  form.isShortlisted = true;
  const isSave = await form.save();
  return res
    .status(200)
    .send({ msg: "Successfully Shortlisted!", success: true, isSave });
});
