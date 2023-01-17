const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
      user: "no-reply-recruitment@cmseducation.org",
      pass: "$^&NoRec",
    },
  });

  const mailOptions = {
    from: "no-reply-recruitment@cmseducation.org",
    to: options.email,
    // to:"shubhjoshi114@gmail.com",
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
