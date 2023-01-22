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
    subject: options.subject,
    text: options.message,
  };

  const res = await transporter.sendMail(mailOptions);
  console.log(res, 'Email');
};

module.exports = sendEmail;
