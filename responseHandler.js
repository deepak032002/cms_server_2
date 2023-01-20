const { default: axios } = require("axios");
const nodeCCAvenue = require("node-ccavenue");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: 1918298,
  working_key: "BD81D9FE1E0C9E2E624FB70E89F01C90",
});

const { StaffForm } = require("./model/staff/staffModel");

exports.postRes = async (request, response) => {
  try {
    const { encResp } = request.body;
    const decryptedJsonResponse = ccav.redirectResponseToJson(encResp);
    console.log(encResp, decryptedJsonResponse);

    const res = await axios.post(
      `https://apitest.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encResp}&access_code=AVXX94KA47AN39XXNA&request_type=json&command=orderStatusTracker&order_no=${decryptedJsonResponse.order_id}`
    );

    console.log(res, "<------------------------");

    if (decryptedJsonResponse.order_status === "Success") {
      const data = await StaffForm.findOneAndUpdate(
        { orderId: decryptedJsonResponse.order_id },
        { paymentConfirmation: true }
      );

      if (data) {
        return response.redirect(
          `${process.env.FRONTEND_URL}/paymentSuccess?status=success&orderNo=${decryptedJsonResponse.order_id}&amount=${decryptedJsonResponse.amount}`
        );
      }
    } else {
      return response.redirect(
        `${process.env.FRONTEND_URL}/paymentSuccess?status=failed&orderNo=${decryptedJsonResponse.order_id}&amount=${decryptedJsonResponse.amount}`
      );
    }
  } catch (error) {
    return response.status(500).send(error);
  }
};
