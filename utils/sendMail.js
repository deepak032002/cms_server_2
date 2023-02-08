const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "vishu.pal@cmseducation.org",
        pass: "P@ss1998",
      },
    });

    const mailOptions = {
      from: "vishu.pal@cmseducation.org",
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

module.exports = sendEmail