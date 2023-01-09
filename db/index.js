const mongoose = require("mongoose");

const conn = async () => {
  try {
    mongoose.set("strictQuery", false);
    const res = await mongoose.connect(
      "mongodb+srv://deepak123:IGD1IEbfkGdnroI7@cluster0.t1mtb.mongodb.net/cms_staff?retryWrites=true&w=majority"
    );

    if (res) {
      console.log("Connect To Database Successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = conn;
