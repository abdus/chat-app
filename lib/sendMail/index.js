const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "dev.abdus@gmail.com",
  from: "Chat Application <azad3652@gmail.com>",
  subject: "Chat App - Account Verification",
  text: ` `,
  // html: 'Please Check Email Soon',
};

module.exports = async (to, url) => {
  msg.to = to;
  msg.html = `Thank you for using our Application! Click on the following link to confirm your email Address <a href="${url}">${url}</a>`;

  try {
    return await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
    }

    return error;
  }
};
