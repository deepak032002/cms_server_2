const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const vacancy = require("./routes/vacancy/staffRoute");
const user = require("./routes/vacancy/userRoute");

require("./db")();
const app = express();
require("dotenv").config({ path: "config/config.env" });

app.use(helmet());
app.use(bodyParser.json());
// app.use(fileUpload({ useTempFiles: true }));
// app.use(bodyParser.urlencoded({ extended: true }));/
app.use(cors());
app.use(morgan("combined"));
app.use("/vacancy/", vacancy);
app.use("/api/v1", user);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8000, () => {
  console.log("listening on port 8000");
});
