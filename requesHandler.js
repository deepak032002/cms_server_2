const crypto = require("crypto");

const encryptData = function (plainText, workingKey) {
  //   var m = crypto.createHash("md5");
  //   m.update(workingKey);
  //   var key = m.digest("binary");
  //   var iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  //   var cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  //   var encoded = cipher.update(plainText, "utf8", "hex");
  //   encoded += cipher.final("hex");
  //   return encoded;

  // create a cipher object using the algorithm you want to use for encryption
  const cipher = crypto.createCipher("aes-256-cbc", workingKey);

  // encrypt the data
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  //   console.log(encrypted);
  return encrypted;
};

exports.postReq = (request, response) => {
  try {
    const workingKey = "BD81D9FE1E0C9E2E624FB70E89F01C90"; //Put in the 32-Bit key shared by CCAvenues.
    const accessCode = "AVXX94KA47AN39XXNA"; //Put in the Access Code shared by CCAvenues.

    if (!request.body) {
      return response.status(404).send("user_info required field!");
    }

    const encRequest = encryptData(JSON.stringify(request.body), workingKey);
    const formBody = `
    <form class="flex items-center justify-center w-full h-full flex-col" id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> 
        <h1 class="text-2xl font-bold">Welcome Your form is successfully filled</h1>
        <h2>Click on continue button and proceed for payment</h2>
        <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}">
        <input type="hidden" name="access_code" id="access_code" value="${accessCode}">
        <button class="bg-red-500 hover:bg-red-600 px-4 py-1 my-6 text-white rounded" onclick="document.redirect.submit();">Continue</button>
    </form>
    `;

    return response.status(200).send(formBody);
  } catch (error) {
    response.status(500).send(error);
  }
};
