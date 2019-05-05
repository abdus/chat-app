let socket = io({
  query: 'roomname=' + window.location.pathname.split('/')[2],
});

// query DOM
let chatWindow = document.getElementById('chat-window');
let inputField = document.getElementById('message-input');
let sendButton = document.getElementById('send-message');
let nameOfTypers = document.getElementById('typers');
let typingStatus = document.querySelector('.hide-typing-status');
let onlineCounter = document.querySelector('#online-count');

// Emmit a message on clicking send
sendButton.addEventListener('click', e => {
  chatEventEmitter();
});

// Emit an event on pressing enter
inputField.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    chatEventEmitter();
  }
  // Emit typing... status
  socket.emit('typing', {
    name: getCookie('username'),
  });
});

// hide typing status is every 4 sec
setInterval(e => {
  typingStatus.style.display = 'none';
}, 4000);

// get message and write it to window
socket.on('chat', e => {
  // Play notification sound
  let audio = new Audio('/sounds/all-eyes-on-me.mp3');
  audio.play();

  // write data on chat window
  chatWindow.innerHTML += writeMessage(e);

  // get the last .card, check if sender and reciver is same, and modify accordingly
  if (e._id === getCookie('_id')) {
    Array.from(document.querySelectorAll('.card')).pop().style.background =
      '#c4c4c469';
  }

  // show the latest chats
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// typing status reciever
socket.on('typing', e => {
  typingStatus.style.display = 'block';
  nameOfTypers.innerHTML = `${e.name.split(' ')[0]}`;
});

// online count reciever (1sec int)
socket.on('onlineCount', e => {
  onlineCounter.innerHTML = e.count;
});

let oldMessagesContainer = document.getElementById('old-messages');

// Fill old messages in DB
fetch('/messages/' + window.location.pathname.split('/')[2])
  .then(res => res.json())
  .then(res => {
    oldMessagesContainer.innerHTML = ''; // clear container text
    for (let i in res) {
      if (res[i].messageType === 'image') {
        oldMessagesContainer.innerHTML += `
                <div class="card">
                    <div class="user-img">
                        <img src="${res[i].avatar}" alt="">
                    </div>
                    <div class="message-meta">
                        <div class="meta">${res[i].name} ${messageTime(
          res[i].time
        )}</div>
                        <div class="message"><img src="${
                          res[i].imgSrc
                        }" alt="" /></div>
                    </div>
                </div>
            `;
      } else {
        oldMessagesContainer.innerHTML += `
                <div class="card">
                    <div class="user-img">
                        <img src="${res[i].avatar}" alt="">
                    </div>
                    <div class="message-meta">
                        <div class="meta">${res[i].name} ${messageTime(
          res[i].time
        )}</div>
                        <div class="message">
                            ${
                              res[i].message.split('/tts ').length > 1
                                ? res[i].message.split('/tts ')[1]
                                : res[i].message
                            }
                        </div>
                    </div>
                </div>
            `;
      }

      // show the latest chats
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // get the last .card, check if sender and reciver is same, and modify accordingly
      if (res[i].user_id === getCookie('_id')) {
        Array.from(document.querySelectorAll('.card')).pop().style.background =
          '#c4c4c469';
      }
    }
  });
