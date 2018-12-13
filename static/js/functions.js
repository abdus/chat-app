const tts = message => {
    if (!message.startsWith('/tts ')) return;
    message = message.slice(4);
    responsiveVoice.speak(message, "UK English Male");
    console.log(message);
    return message;
}

// FUNCTIONS
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


// for parsing date
const messageTime = dateMili => {
    let dateStr = new Date(dateMili).toString();
    let dateNowStr = new Date(Date.now()).toString();
    let date = dateStr.split(' ')[2] + ' ' + dateStr.split(' ')[1] + ' ' + dateStr.split(' ')[3];
    let dateNow = dateNowStr.split(' ')[2] + ' ' + dateNowStr.split(' ')[1] + ' ' + dateNowStr.split(' ')[3];
    let time = dateStr.split(' ')[4].split(':');
    time = time[0] + ':' + time[1];

    if (date === dateNow) return `at ${time}`;
    else return `on ${date} at ${time}`;
}



// Function Emit Chat
const chatEventEmitter = () => {
    if (inputField.value.trim() !== '') {
        socket.emit('chat', {
            _id: getCookie('_id'),
            type: 'text',
            name: getCookie('username'),
            message: inputField.value,
            time: Date.now(),
            avatar: getCookie('avatar') !== '' ? getCookie('avatar') : 'https://banner2.kisspng.com/20180319/pde/kisspng-computer-icons-icon-design-avatar-flat-face-icon-5ab06e33bee962.122118601521511987782.jpg'
        });
        inputField.value = '';
        typingStatus.style.display = 'none'
    }
}


// converts image to base64 uri
const toDataURI = (fileInput, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = () => {
        cb(reader.result);
    };
}
