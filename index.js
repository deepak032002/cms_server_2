const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
const express = require("express");
require("./db")();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const vacancy = require("./routes/vacancy/staffRoute");
const user = require("./routes/vacancy/userRoute");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");

(async () => {
  try {
    // const SESS_LIFETIME = 1000 * 60 * 60 * 2;
    // const NODE_ENV = "development";
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

    // app.use(
    //   session({
    //     secret: "9AFE26E4A68335A443473A3E2FFC3",
    //     resave: false,
    //     store: MongoStore.create({
    //       mongoUrl: process.env.DB,
    //       collection: "session",
    //       ttl: parseInt(SESS_LIFETIME) / 1000,
    //     }),
    //     cookie: {
    //       sameSite: true,
    //       secure: NODE_ENV === "production",
    //       maxAge: parseInt(SESS_LIFETIME),
    //     },
    //     saveUninitialized: true,
    //   })
    // );

    app.use("/api", vacancy);
    app.use("/api/v1", user);
    app.use("/api/v1", admin);

    // app.set("trust proxy", 1); // trust first proxy

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
