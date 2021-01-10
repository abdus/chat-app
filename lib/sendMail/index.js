const nodemailer = require("nodemailer");

const msg = {
  from: "Chat Application <switchup@firemail.cc>",
  subject: "Chat App - Account Verification",
  text: ` `,
};
const transporter = nodemailer.createTransport({
  host: "mail.cock.li",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = async (to, url) => {
  msg.to = to;
  msg.html = `Thank you for using our Application! Click on the following link to confirm your email Address <a href="${url}">${url}</a>`;

  try {
    await transporter.sendMail(msg);
    return true;
  } catch (err) {
    console.log(err.stack);
    return err;
  }
};
