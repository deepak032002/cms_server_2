const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 587,
      auth: {
        user: "reply3258@gmail.com",
        pass: "housnpfkojkoklfr",
      },
    });

    const mailOptions = {
      from: "reply3258@gmail.com",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    return;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
