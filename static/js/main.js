let socket = io();

// query DOM
let chatWindow = document.getElementById('chat-window');
let inputField = document.getElementById('message-input');
let sendButton = document.getElementById('send-message');
let nameOfTypers = document.getElementById('typers');
let typingStatus = document.querySelector('.hide-typing-status');
let userName = document.getElementById('user-name');
let userAvatar = document.getElementById('user-avatar');
let onlineCounter = document.querySelector('#online-count')

// Emmit a message on clicking send
sendButton.addEventListener('click', e => {
    chatEventEmitter();
});

// Emit an event on pressing enter
inputField.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
        chatEventEmitter();
    }
    // Emit typing... status 
    socket.emit('typing', {
        name: getCookie('username')
    })
});

// hide typing status is every 4 sec
setInterval(e => {
    typingStatus.style.display = 'none';
}, 4000)


// get message and write it to window 
socket.on('chat', e => {
    // Play notification sound 
    let audio = new Audio('/sounds/all-eyes-on-me.mp3');
    audio.play();

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
})

// typing status reciever
socket.on('typing', e => {
    typingStatus.style.display = 'block'
    nameOfTypers.innerHTML = `${(e.name).split(' ')[0]}`
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
        document.cookie = 'avatar=' + userAvatar.value.trim() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        document.cookie = '_id=' + btoa(Math.random()) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        document.getElementById('model').style.display = 'none';
    }
})

// _id: "5c1148674b72060051c1b8fb"
// // // avatar: "https://banner2.kisspng.com/20180319/pde/kisspng-computer-icons-icon-design-avatar-flat-face-icon-5ab06e33bee962.122118601521511987782.jpg"
// message: "/tts korilu ko etia"
// messageType: "text"
// name: "ARUP jyoti"
// time: 1544636518999
// user_id: "MC41NTQxMDM3MjQ5Njg0ODMz"

let oldMessagesContainer = document.getElementById('old-messages')

// Fill old messages in DB 
fetch('/messages')
.then(res => res.json())
.then(res => {
    for(let i of res) {
        if (i.messageType === 'image') {
            oldMessagesContainer.innerHTML += `
                <div class="card">
                    <div class="user-img">
                        <img src="${i.avatar}" alt="">
                    </div>
                    <div class="message-meta">
                        <div class="meta">${i.name} ${messageTime(i.time)}</div>
                        <div class="message"><img src="${i.imgSrc}" alt="" /></div>
                    </div>
                </div>
            `
        } else {
            oldMessagesContainer.innerHTML += `
                <div class="card">
                    <div class="user-img">
                        <img src="${i.avatar}" alt="">
                    </div>
                    <div class="message-meta">
                        <div class="meta">${i.name} ${messageTime(i.time)}</div>
                        <div class="message">
                            ${i.message.split('/tts ').length > 1 ? i.message.split('/tts ')[1] : i.message}
                        </div>
                    </div>
                </div>
            `
        }

        // show the latest chats 
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        // get the last .card, check if sender and reciver is same, and modify accordingly
        if(i.user_id === getCookie('_id')) {
            Array.from(document.querySelectorAll('.card')).pop().style.background = '#c4c4c469'
        }
    }
})