// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  // console.log(user);
  const token = user.getJWTToken();
  // console.log("here");
  // console.log(token)

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
