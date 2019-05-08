const dns = require('dns');

const verifyEmail = email => {
  return new Promise((resolve, reject) => {
    dns.resolve(email.split('@')[1], 'MX', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = verifyEmail;
verifyEmail('abdus@bnkldsnkldgfsnkl.com')
  .then(data => {
    console.log(data);
  })
  .catch(e => console.log(e.message, e.code));
