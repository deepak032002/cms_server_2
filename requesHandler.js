const nodeCCAvenue = require("node-ccavenue");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: 1918298,
  working_key: "BD81D9FE1E0C9E2E624FB70E89F01C90",
});

const orderid = require("order-id")("1918BD81D9FE1EAC9E2E624FB70E89F01C90298");

const { StaffForm } = require("./model/staff/staffModel");

exports.postReq = async (request, response) => {
  try {
    const accessCode = "AVXX94KA47AN39XXNA";
    if (!request.body.billing_name && !request.body.order_id) {
      return response.status(404).send("orderId and name must");
    }
    const id = orderid.generate();
    let orderId = "";

    while (true) {
      orderId = "CMS-" + orderid.getTime(id);
      let isExistOrderId = await StaffForm.findOne({ orderId: orderId });
      if (!isExistOrderId) {
        break;
      }
    }

    const orderParams = {
      order_id: orderId,
      currency: "INR",
      amount: "600",
      cancel_url: encodeURIComponent(
        `${process.env.REDIRECT_URL}/api/paymentResponse/`
      ),
      redirect_url: encodeURIComponent(
        `${process.env.REDIRECT_URL}/api/paymentResponse/`
      ),
      billing_name: request.body.billing_name,
    };

    const isPaymentDone = await StaffForm.findOne({ userId: request.user });

    if (isPaymentDone.paymentConfirmation) {
      return response
        .status(200)
        .send("<h1 class='text-2xl font-bold'>Payment Already Done!</h1>");
    }

    const data = await StaffForm.findOneAndUpdate(
      { userId: request.user },
      {
        orderId: orderId,
        $push: { orderList: orderId },
      }
    );

    if (data) {
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      // console.log("Encrypted Request String-", encryptedOrderData);
      const formBody = `
      <form class="flex items-center justify-center w-full h-full flex-col" id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/>
          <h1 class="text-3xl font-bold">Welcome Your form is successfully filled</h1>
          <h2>Click on continue button and proceed for payment</h2>
          <input type="hidden" id="encRequest" name="encRequest" value="${encryptedOrderData}">
          <input type="hidden" name="access_code" id="access_code" value="${accessCode}">
          <button class="bg-red-500 hover:bg-red-600 px-4 py-1 my-6 text-white rounded" onclick="document.redirect.submit();">Continue</button>
      </form>
    `;

      return response.status(200).send(formBody);
    }
  } catch (error) {
    response.status(400).send(error);
  }
};
