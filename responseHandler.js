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

    if (decryptedJsonResponse.order_status === "Success") {
      const data = await StaffForm.findOneAndUpdate(
        { orderId: decryptedJsonResponse.order_id },
        { paymentConfirmation: true }
      );

      if (data) {
        return response.redirect(
          `${process.env.FRONTEND_URL}/paymentSuccess?status=success`
        );
      }
    } else {
      return response.redirect(
        `${process.env.FRONTEND_URL}/paymentSuccess?status=failed`
      );
    }
  } catch (error) {
    return response.status(500).send(error);
  }
};
