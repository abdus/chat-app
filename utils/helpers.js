const fetch = require('node-fetch');

const parseJWT = cookie => {
  return cookie.jwt ? cookie.jwt : null;

  // if (!authHeader) return '';
  // return authHeader.split('Bearer')[1] ? authHeader.split('Bearer')[1] : '';
};

/**
 * For Uploading Image to ImageBB and storing the path in DB
 */
const uploadImage = (base64Data, name) => {
  require('fs').writeFileSync('base64.txt', base64Data, { encoding: 'utf-8' });
  const base_url = 'https://api.imgur.com/3/upload';

  fetch(`${base_url}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.IMGUR_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      image: base64Data,
      name: name,
      title: name,
    }),
  })
    .then(data => data.json())
    .then(data => {
      console.log(0);
    });
};

module.exports = {
  parseJWT,
  uploadImage,
};
