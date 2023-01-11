const mongoose = require("mongoose");

const staffFormSchema = mongoose.Schema({
  registrationNum: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  academic: {
    type: String,
  },
  subject: {
    type: String,
  },

  designation: {
    type: String,
  },

  campus_prefrence: {
    type: Array,
    required: true,
  },

  personal_details: {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
    },
    last_name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },

    user: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    father: {
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
      occupation: {
        type: String,
      },
    },

    mother: {
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
      },
      occupation: {
        type: String,
      },
    },

    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    marital_status: {
      type: String,
      required: true,
    },
    aadhar_number: {
      type: Number,
      required: true,
    },
  },

  communication: {
    type: Array,
    required: true,
  },

  address: {
    permanent: {
      type: Object,
      required: true,
    },
    current: {
      type: Object,
    },
  },

  academic_details: {
    type: Object,
    required: true,
  },

  work_experience: {
    type: Array,
    required: true,
  },

  earliest_date_join: {
    type: Date,
    required: true,
  },
  total_experience: {
    type: Number,
    required: true,
  },

  blood_relative: {
    type: Object,
  },

  before_working_in_payroll: {
    type: String,
    required: true,
  },

  declaration: {
    type: Boolean,
    required: true,
  },

  isShortlisted: {
    type: Boolean,
    required: true,
  },
  paymentConfirmation: {
    type: Boolean,
    required: true,
  },
});

const StaffForm = mongoose.model("staffForm", staffFormSchema);
StaffForm.createIndexes();
exports.StaffForm = StaffForm;

// =============== Staff Schema ===========================

const staffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const Staff = mongoose.model("staff", staffSchema);
Staff.createIndexes();
exports.Staff = Staff;
