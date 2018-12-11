let socket = io();

// query DOM
let chatWindow = document.getElementById('chat-window');
let inputField = document.getElementById('message-input');
let sendButton = document.getElementById('send-message');
let nameOfTypers = document.getElementById('typers');
let typingStatus = document.querySelector('.hide-typing-status');
let userName = document.getElementById('user-name');
let onlineCounter = document.querySelector('#online-count')

// Emmit a message on clicking send
sendButton.addEventListener('click', e => {
    chatEventEmitter();
    inputField.value = '';
});

// TODO: refactor this
inputField.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
        chatEventEmitter();
    }
});

// Emit typing....
inputField.addEventListener('keydown', e => {
    socket.emit('typing', {
        name: getCookie('username')
    })
})


// get message and write it to window 
socket.on('chat', e => {

    // write data on chat window
    if (e.type === 'image') {
        chatWindow.innerHTML += `
            <div class="card">
                <div class="user-img">
                    <img src="${e.avatar}" alt="">
                </div>
                <div class="message-meta">
                    <div class="meta">${e.name} ${messageTime(e.time)}</div>
                    <div class="message"><img src="${e.imgSrc}" alt="" /></div>
                </div>
            </div>
        `
    } else {
        chatWindow.innerHTML += `
            <div class="card">
                <div class="user-img">
                    <img src="${e.avatar}" alt="">
                </div>
                <div class="message-meta">
                    <div class="meta">${e.name} ${messageTime(e.time)}</div>
                    <div class="message">${tts(e.message) ? tts(e.message) : e.message}</div>
                </div>
            </div>
        `
    }
    // get the last .card, check if sender and reciver is same, and modify accordingly
    if(e._id === getCookie('_id')) {
        Array.from(document.querySelectorAll('.card')).pop().style.background = '#c4c4c469'
    }

    // show the latest chats 
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // remove 'typing...' badge on reciver
    if (typingStatus.classList.contains('reveal-typing-status')) {
        typingStatus.classList.toggle('reveal-typing-status')
        nameOfTypers.innerHTML = '';
    } else {
        nameOfTypers.innerHTML = '';
    }

    // Play notification sound 
    let audio = new Audio('/sounds/definite.mp3');
    audio.play();
})

// typing status reciever
socket.on('typing', e => {
    if (!typingStatus.classList.contains('reveal-typing-status')) {
        typingStatus.classList.toggle('reveal-typing-status');
        nameOfTypers.innerHTML = `${(e.name).split(' ')[0]}`
    } else {
        nameOfTypers.innerHTML = `${(e.name).split(' ')[0]}`
    }
})

// online count reciever (1sec int)
socket.on('onlineCount', e => {
    onlineCounter.innerHTML = e.count
})

//  check if name already exist before displaying 'Enter Name' splash screen
if(getCookie('username') !== '') {
    document.getElementById('model').style.display = 'none';
} else {
    document.getElementById('model').style.display = 'block';
}

// display 'Enter Name' splash screen
document.getElementById('user-submit').addEventListener('click', e => {
    e.preventDefault();
    if (userName.value.trim() !== '') {
        document.cookie = 'username=' + userName.value.trim() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        document.cookie = '_id=' + btoa(Math.random()) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        document.getElementById('model').style.display = 'none';
    }
})


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
            avatar: 'https://banner2.kisspng.com/20180319/pde/kisspng-computer-icons-icon-design-avatar-flat-face-icon-5ab06e33bee962.122118601521511987782.jpg'
        });
        inputField.value = '';
        if (typingStatus.classList.contains('reveal-typing-status')) {
            typingStatus.classList.toggle('reveal-typing-status')
            nameOfTypers.innerHTML = '';
        } else {
            nameOfTypers.innerHTML = '';
        }
    } 
}