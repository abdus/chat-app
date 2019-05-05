const dns = require('dns');
const email = 'info@thisisabdus.dev';

module.exports = () => {
  return new Promise((resolve, reject) => {
    dns.resolve(email.split('@')[1], 'MX', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};
