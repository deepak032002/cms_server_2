const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtps.gmail.com",
      secure: true,
      port: 587,
      auth: {
        user: "no-reply-recruitment@cmseducation.org",
        pass: "$^&NoRec",
      },
    });

    const mailOptions = {
      from: "no-reply-recruitment@cmseducation.org",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const res = await transporter.sendMail(mailOptions);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
