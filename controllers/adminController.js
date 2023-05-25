const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { StaffForm } = require("../model/staff/staffModel");
const { Sequelize } = require("sequelize");

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
      total_count: count,
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

  if (type === "mobile") {
    const result = await StaffForm.find({ "personal_details.mobile": query });

    if (result.length === 0) return res.status(404).send("No data found!");

    return res.status(200).send({ success: true, result });
  }

  if (type === "date") {
    const result = await StaffForm.find()
      .where("createdAt")
      .gte(new Date(query.startDate))
      .lte(new Date(query.endDate));

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

exports.getAllData = async (req, res) => {
  try {
    const allApplicants = await StaffForm.find();
    if (!allApplicants) return res.status(404).send("No Data Found");

    return res.status(200).send({ success: true, allApplicants });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.migrateData = async (req, res) => {
  try {
    // migrate data from mongodb to ms sql server using sequelize1

    const sequelize = new Sequelize(
      "VacancyVishu",
      "erp",
      "$/)rTHYSeRvERki23(",
      {
        host: "18.135.212.105",
        dialect: "mssql",
      }
    );

    const { DataTypes } = require("sequelize");

    const User = sequelize.define("User", {
      registrationNum: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orderList: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      academic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      campus_prefrence: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      personal_details: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      communication: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      payrollCms: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      academic_details: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      work_experience: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      earliest_date_join: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_experience: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      trackingId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      blood_relative: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      before_working_in_payroll: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referenceName1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referenceName2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referenceMobile1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referenceMobile2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      declaration: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      trainings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [
          { name: "B.ed", isDo: false },
          { name: "LT", isDo: false },
          { name: "NTT", isDo: false },
          { name: "M.ed", isDo: false },
          { name: "NIS", isDo: false },
        ],
      },
      isShortlisted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      paymentConfirmation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      paymentData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    });

    sequelize.authenticate().then(async () => {
      sequelize.sync({ force: true }).then(async () => {
        const allform = await StaffForm.find();

        allform.forEach(async (form) => {
          await User.create({
            registrationNum: form.registrationNum,
            category: form.category,
            academic: form.academic,
            subject: form.subject,
            campus_prefrence: form.campus_prefrence,
            personal_details: form.personal_details,
            communication: form.communication,
            address: form.address,
            academic_details: form.academic_details,
            work_experience: form.work_experience,
            earliest_date_join: form.earliest_date_join,
            total_experience: form.total_experience,
            blood_relative: form.blood_relative,
            before_working_in_payroll: form.before_working_in_payroll,
            referenceName1: form.referenceName1,
            referenceName2: form.referenceName2,
            referenceMobile1: form.referenceMobile1,
            referenceMobile2: form.referenceMobile2,
            declaration: form.declaration,
            trainings: form.trainings,
            paymentData: form.paymentData,
            isShortlisted: form.isShortlisted,
            paymentConfirmation: form.paymentConfirmation,
            userId: form.userId,
            orderId: form.orderId,
            orderList: form.orderList,
            designation: form.designation,
            payrollCms: form.payrollCms,
            trackingId: form.trackingId,
          });
        });

        const allUsers = await User.findAll();

        res
          .status(200)
          .send({ message: "Data Migrated Successfully", allUsers });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};
