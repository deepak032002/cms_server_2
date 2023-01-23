const nodeCCAvenue = require("node-ccavenue");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: 1918298,
  working_key: "BD81D9FE1E0C9E2E624FB70E89F01C90",
});

const { StaffForm } = require("./model/staff/staffModel");

// const encryptData = function (data) {
//   const stringToEncrypt = `${workingKey}|${data.merchant_id}|${data.order_id}|${data.amount}|${data.currency}|${data.redirect_url}|${data.cancel_url}|${data.billing_name}|${data.billing_address}|${data.billing_city}|${data.billing_state}|${data.billing_zip}|${data.billing_country}|${data.billing_tel}|${data.billing_email}|${data.delivery_name}|${data.delivery_address}|${data.delivery_city}|${data.delivery_state}|${data.delivery_zip}|${data.delivery_country}|${data.delivery_tel}|${data.merchant_param1}|${data.merchant_param2}|${data.merchant_param3}|${data.merchant_param4}|${data.merchant_param5}`;
//   // const iv = crypto.randomBytes(16);
//   // const cipher = crypto.createCipheriv("aes-256-cbc", workingKey, iv);

//   // // encrypt the data
//   // let encrypted = cipher.update(stringToEncrypt, "utf8", "hex");
//   // encrypted += cipher.final("hex");

//   // return encrypted;

//   const encryptedOrderData = ccav.getEncryptedOrder(stringToEncrypt);
//   console.log(encryptedOrderData, "<---");

//   return encryptedOrderData;
//   // return encryptRequest(data);
// };

exports.postReq = async (request, response) => {
  try {
    const accessCode = "AVXX94KA47AN39XXNA";
    if (!request.body.billing_name && !request.body.order_id) {
      return response.status(404).send("orderId and name must");
    }

    const orderParams = {
      order_id: request.body.order_id,
      currency: "INR",
      amount: "600",
      cancel_url: encodeURIComponent(
        `${process.env.REDIRECT_URL}/paymentResponse/`
      ),
      redirect_url: encodeURIComponent(
        `${process.env.REDIRECT_URL}/paymentResponse/`
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
      { orderId: request.body.order_id }
    );

    if (data) {
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      console.log("Encrypted Request String-", encryptedOrderData);
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
