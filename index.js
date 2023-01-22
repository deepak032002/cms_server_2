const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const vacancy = require("./routes/vacancy/staffRoute");
const user = require("./routes/vacancy/userRoute");
const cookieParser = require("cookie-parser");

require("./db")();
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));
app.use("/api/", vacancy);
app.use("/api/v1", user);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8000, () => {
  console.log("listening on port 8000");
});
