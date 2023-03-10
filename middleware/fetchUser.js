const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  try {
    const token = req.header("Authorisation");
    if (!token) {
      return res.status(401).json({ err: "Token is Wrong/Not found!" });
    }
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.userId;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = fetchUser;
