const { default: axios } = require("axios");
const nodeCCAvenue = require("node-ccavenue");
const querystring = require("querystring");
const crypto = require("crypto");

const ccav = new nodeCCAvenue.Configure({
  merchant_id: 1918298,
  working_key: "BD81D9FE1E0C9E2E624FB70E89F01C90",
});

const { StaffForm } = require("./model/staff/staffModel");
const sendEmail = require("./utils/sendMail");

function encrypt(plainText, key = "BD81D9FE1E0C9E2E624FB70E89F01C90") {
  const keyHash = crypto.createHash("md5").update(key).digest();
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, initVector);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText, key = "BD81D9FE1E0C9E2E624FB70E89F01C90") {
  const keyHash = crypto.createHash("md5").update(key).digest();
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
  const decipher = crypto.createDecipheriv("aes-128-cbc", keyHash, initVector);
  let decrypted = decipher.update(encryptedTextBuffer, "binary", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

exports.postRes = async (request, response) => {
  try {
    const { encResp } = request.body;
    const decryptedJsonResponse = ccav.redirectResponseToJson(encResp);
    console.log(encResp, decryptedJsonResponse);

    const { order_id, tracking_id } = decryptedJsonResponse;

    // #####################################

    const access_code = "AVXX94KA47AN39XXNA";
    const params = { order_no: order_id, reference_no: tracking_id };

    const encReq = encrypt(JSON.stringify(params));

    const final_data = querystring.stringify({
      enc_request: encReq,
      access_code: access_code,
      command: "orderStatusTracker",
      request_type: "JSON",
      response_type: "JSON",
    });

    const ccavenue_res = await axios.post(
      `https://apitest.ccavenue.com/apis/servlet/DoWebTrans`,
      final_data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const info = querystring.parse(ccavenue_res.data);
    if (info.enc_response) {
      console.log(info.enc_response);
      const payment_status = decrypt(info.enc_response);

      const data = await StaffForm.findOneAndUpdate(
        { orderId: decryptedJsonResponse.order_id },
        {
          paymentConfirmation:
            JSON.parse(payment_status)?.Order_Status_Result
              ?.order_bank_response === "Y",
          paymentData: JSON.parse(payment_status),
          orderId: null,
        }
      );

      if (
        data &&
        JSON.parse(payment_status)?.Order_Status_Result?.order_bank_response ===
          "Y"
      ) {
        const message = `
        Dear Candidate,
          Your Payment successfully completed
          Your order-id ${decryptedJsonResponse?.order_id} for Registration No. - ${data?.registrationNum}
          We contact you soon!
        `;

        await sendEmail({
          email: data?.personal_details?.email,
          subject: "Successfull registration!",
          message: message,
        });

        return response.redirect(
          `${process.env.FRONTEND_URL}/paymentSuccess?status=success&orderNo=${decryptedJsonResponse.order_id}&amount=${decryptedJsonResponse.amount}`
        );
      }
    }

    // #####################################

    return response.redirect(
      `${process.env.FRONTEND_URL}/paymentSuccess?status=failed&orderNo=${decryptedJsonResponse.order_id}&amount=${decryptedJsonResponse.amount}`
    );
  } catch (error) {
    return response.status(500).send(error);
  }
};
