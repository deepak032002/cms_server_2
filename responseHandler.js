const qs = require("querystring");
const crypto = require("crypto");
const decrypt = function (encText, workingKey) {
  var m = crypto.createHash("md5");
  m.update(workingKey);
  var key = m.digest("binary");
  var iv = crypto.randomBytes(16);
  var decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  var decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return decoded;
};

exports.postRes = function (request, response) {
  // let ccavEncResponse = "";
  // let ccavResponse = "";
  // let ccavPOST = "";

  try {
    const workingKey = "BD81D9FE1E0C9E2E624FB70E89F01C90";
    const accessCode = "AVXX94KA47AN39XXNA";

    // ccavEncResponse += request.data;
    // ccavPOST = qs.parse(ccavEncResponse);
    // var encryption = ccavPOST.encResp;

    if (!request.body.data) {
      return response.status(404).send("Data not found!");
    }

    const decryptData = decrypt(request.body.data, workingKey);
    response.send(decryptData);
  } catch (error) {
    response.status(400).send(error);
  }

  // var pData = "";
  // pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
  // pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
  // pData = pData.replace(/&/gi, "</td></tr><tr><td>");
  // pData = pData + "</td></tr></table>";
  // htmlcode =
  //   '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
  //   pData +
  //   "</center><br></body></html>";
};
