const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "reply3258@gmail.com",
        pass: "housnpfkojkoklfr",
      },
    });

    const mailOptions = {
      from: "reply325@gmail.com",
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
