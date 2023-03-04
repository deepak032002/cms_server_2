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
  const page = req.params.pageNumber;
  const limit = req.params.pageSize;

  console.log(page);
  const allApplicants = await StaffForm.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await StaffForm.countDocuments();

  res.status(200).json({
    success: true,
    data: allApplicants,
    totalPages: Math.ceil(count / limit),
    message: "All Applicants",
    total_count: count,
  });
});
exports.allShortlistedApplications = catchAsyncErrors(
  async (req, res, next) => {
    const page = req.params.pageNumber;
    const limit = req.params.pageSize;
    const allShortlistedApplications = await StaffForm.find({
      isShortlisted: true,
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await StaffForm.countDocuments({
      isShortlisted: true,
    });

    res.status(200).json({
      success: true,
      data: allShortlistedApplications,
      totalPages: Math.ceil(count / limit),
      message: "All Shortlisted Applicants",
      total_count: count
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

exports.search = catchAsyncErrors(async (req, res, next) => {
  let { query, type } = req.body;

  if (!query || !type) {
    return res.status(400).send("Please enter some data");
  }

  if (type === "id") {
    const result = await StaffForm.find({ registrationNum: query });

    if (result.length === 0) return res.status(404).send("No data found!");

    return res.status(200).send({ success: true, result });
  }

  const regex = new RegExp(query, "ig");
  const result = await StaffForm.find({
    "personal_details.first_name": regex,
  });

  if (result.length === 0) return res.status(404).send("No data found!");
  return res.status(200).send({ success: true, result });
});
