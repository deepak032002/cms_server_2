const multer = require("multer");

const multer_config = {
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
};

const storage = multer.diskStorage(multer_config);
const upload = multer({ storage });

module.exports = upload;
