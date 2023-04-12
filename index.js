const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
require("./db")();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const vacancy = require("./routes/vacancy/staffRoute");
const user = require("./routes/vacancy/userRoute");
const cookieParser = require("cookie-parser");

(async () => {
  try {
    const admin = require("./routes/vacancy/adminRoutes");
    const PORT = process.env.PORT || 8000;
    const app = express();
    app.disable("x-powered-by");
    app.use(helmet());
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan("dev"));
    app.use("/api", vacancy);
    app.use("/api/v1", user);
    app.use("/api/v1", admin);

    app.get("/", (req, res) => {
      res.status(200).send("Hello");
    });

    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
