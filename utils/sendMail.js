const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtppro.zoho.in",
      secure: true,
      port: 465,
      auth: {
        user: "cmstest21@zohomail.in",
        pass: "cJwJm4jzM#hKEPd",
      },
    });

    const mailOptions = {
      from: "cmstest21@zohomail.in",
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
