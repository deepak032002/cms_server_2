const mongoose = require("mongoose");

const conn = async () => {
  try {
    mongoose.set("strictQuery", false);
    const res = await mongoose.connect(process.env.DB);
    if (res) {
      console.log("Connect To Database Successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = conn;
