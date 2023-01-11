const crypto = require("crypto");

const encryptData = function (data, workingKey) {
  // function encryptRequest(data) {

  //   const encryptedData = crypto
  //     .createCipheriv("aes-128-cbc", workingKey, "9876543210987654")
  //     .update(stringToEncrypt, "utf8", "base64");
  //   return encryptedData;
  // }
  const stringToEncrypt = `${workingKey}|${data.order_id}|${data.amount}|${data.currency}|${data.merchant_id}|||||||||||`;
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", workingKey, iv);

  // encrypt the data
  let encrypted = cipher.update(stringToEncrypt, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;

  // return encryptRequest(data);
};

exports.postReq = (request, response) => {
  try {
    const workingKey = "BD81D9FE1E0C9E2E624FB70E89F01C90";
    const accessCode = "AVXX94KA47AN39XXNA";

    if (!request.body) {
      return response.status(404).send("user_info required field!");
    }

    const encRequest = encryptData(request.body, workingKey);
    const formBody = `
    <form class="flex items-center justify-center w-full h-full flex-col" id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> 
        <h1 class="text-3xl font-bold">Welcome Your form is successfully filled</h1>
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
