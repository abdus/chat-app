const tts = message => {
  if (!message.startsWith('/tts ')) return;
  message = message.slice(4);
  responsiveVoice.speak(message, 'UK English Male');
  console.log(message);
  return message;
};

// FUNCTIONS
function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

// for parsing date
const messageTime = dateMili => {
  let dateStr = new Date(dateMili).toString();
  let dateNowStr = new Date(Date.now()).toString();
  let date =
    dateStr.split(' ')[2] +
    ' ' +
    dateStr.split(' ')[1] +
    ' ' +
    dateStr.split(' ')[3];
  let dateNow =
    dateNowStr.split(' ')[2] +
    ' ' +
    dateNowStr.split(' ')[1] +
    ' ' +
    dateNowStr.split(' ')[3];
  let time = dateStr.split(' ')[4].split(':');
  time = time[0] + ':' + time[1];

  if (date === dateNow) return `at ${time}`;
  else return `on ${date} at ${time}`;
};

// Function Emit Chat
const chatEventEmitter = () => {
  if (inputField.value.trim() !== '') {
    socket.emit('chat', {
      jwt: getCookie('jwt'),
      type: 'text',
      message: inputField.value,
      time: Date.now(),
      avatar:
        getCookie('avatar') !== ''
          ? getCookie('avatar')
          : 'https://pixel.nymag.com/imgs/daily/vulture/2018/11/02/02-avatar-2.w700.h700.jpg',
      chatRoom: window.location.pathname.split('/')[2],
    });
    inputField.value = '';
    typingStatus.style.display = 'none';
  }
};

// converts image to base64 uri
const toDataURI = (fileInput, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = () => {
    cb(reader.result);
  };
};

// Function that will write messages in message-window
const writeMessage = message => {
  if (message.type === 'image') {
    return `<div class="card">
                <div class="user-img">
                    <img src="${message.avatar}" alt="">
                </div>
                <div class="message-meta">
                    <div class="meta">${message.name} ${messageTime(
      message.time
    )}</div>
                    <div class="message"><img src="${
                      message.imgSrc
                    }" alt="" /></div>
                </div>
            </div>
        `;
  } else {
    return `
            <div class="card">
                <div class="user-img">
                    <img src="${message.avatar}" alt="">
                </div>
                <div class="message-meta">
                    <div class="meta">${message.name} ${messageTime(
      message.time
    )}</div>
                    <div class="message">${
                      tts(message.message)
                        ? tts(message.message)
                        : message.message
                    }</div>
                </div>
            </div>
        `;
  }
};
