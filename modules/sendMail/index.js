const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');
const msg = {
  to: 'dev.abdus@gmail.com',
  from: 'Chat Application <azad3652@gmail.com>',
  subject: 'Chat App - Account Verification',
  text: ` `,
  // html: 'Please Check Email Soon',
};

module.exports = (to, url) => {
  msg.to = to;
  msg.html = `Thank you for using our Application! Click on the following link to confirm your email Address <a href="${url}">${url}</a>`;

  return new Promise((resolve, reject) => {
    sgMail.send(msg, err => (err ? reject(err) : resolve(true)));
  });
};
