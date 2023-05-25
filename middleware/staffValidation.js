const Joi = require("joi");

const staffSchemaValidate = Joi.object()
  .keys({
    _id: Joi.string(),
    __v: Joi.string(),
    orderId: Joi.string(),
    registrationNum: Joi.string().required(),
    userId: Joi.string().required(),
    academic: Joi.string().allow(null, ""),
    subject: Joi.string().allow(null, ""),
    designation: Joi.string().allow(null, ""),
    user: Joi.string(),
    category: Joi.string().required(),
    campus_prefrence: Joi.array().required(),
    personal_details: Joi.object({
      image_url: Joi.string(),
      first_name: Joi.string().required(),
      middle_name: Joi.string().allow(null, ""),
      last_name: Joi.string().required(),
      dob: Joi.date().required(),
      image: Joi.string(),
      spouse: Joi.string(),
      father: Joi.object({
        name: Joi.string().required(),
        mobile: Joi.number().required(),
        occupation: Joi.string().required(),
      }),
      mother: Joi.object({
        name: Joi.string(),
        mobile: Joi.number().allow(null, ""),
        occupation: Joi.string().allow(null, ""),
      }),
      mobile: Joi.string().required(),
      email: Joi.string().required(),
      gender: Joi.string().required(),
      marital_status: Joi.string().required(),
      aadhar_number: Joi.number().required(),
    }).required(),
    payrollCms: Joi.object(),
    communication: Joi.array().required(),
    address: Joi.object({
      permanent: Joi.object().required(),
      current: Joi.object().required(),
    }).required(),
    academic_details: Joi.object().required(),
    work_experience: Joi.array(),
    earliest_date_join: Joi.date().required(),
    total_experience: Joi.string().required(),
    blood_relative: Joi.object(),
    before_working_in_payroll: Joi.string(),
    declaration: Joi.boolean().required(),
    isShortlisted: Joi.boolean(),
    paymentConfirmation: Joi.boolean(),
  })
  .unknown(true);

module.exports = staffSchemaValidate;
