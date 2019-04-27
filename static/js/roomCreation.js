let roomCreateButton = document.getElementById('new-room');
let roomCard = document.getElementById('room-card');
let roomURL = document.getElementById('room-url');
let createRoom = document.querySelector('#room-card button');
let cancelRoomCreation = document.getElementById('cancel-room-creation');

roomCreateButton.addEventListener('click', e => {
  roomCard.classList.toggle('room-card-hide');
});

cancelRoomCreation.addEventListener('click', e => {
  roomCard.classList.toggle('room-card-hide');
});

createRoom.addEventListener('click', e => {
  let value = document.querySelector('#room-card input').value.trim();
  if (value === '') {
    roomURL.innerHTML = `https://${window.location.host}/room/${btoa(
      Math.random()
    )}`;
    roomURL.href = `https://${window.location.host}/room/${btoa(
      Math.random()
    )}`;
  } else {
    roomURL.innerHTML = `https://${window.location.host}/room/${value}`;
    roomURL.href = `https://${window.location.host}/room/${value}`;
  }
});
