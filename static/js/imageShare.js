let imageShareWindow = document.getElementById('img-share');
let imageShareButton = document.getElementById('image-share-button');
let cancelImageShareButton = document.getElementById('cancel-image-share');
let imageSubmitButton = document.getElementById('image-submit-button');
let imageInputField = document.getElementById('image-input-field');
let imagePreviewer = document.getElementById('image-preview');
let img = document.createElement('img');

// for opening share window
imageShareButton.addEventListener('click', e => {
  e.preventDefault();
  imageShareWindow.style.display = 'block';
});

// for canceling image sharing
cancelImageShareButton.addEventListener('click', e => {
  imageShareWindow.style.display = 'none';
});

// to load preview image as soon as file selected
imageInputField.addEventListener('change', e => {
  toDataURI(imageInputField, e => {
    img.src = e;
    imagePreviewer.appendChild(img);
    img = document.createElement('img');
  });
});

// share and emit event
imageSubmitButton.addEventListener('click', e => {
  toDataURI(imageInputField, uri => {
    socket.emit('chat', {
      type: 'image',
      jwt: getCookie('jwt'),
      imgSrc: uri,
      time: Date.now(),
      avatar:
        getCookie('avatar') !== ''
          ? getCookie('avatar')
          : 'https://banner2.kisspng.com/20180319/pde/kisspng-computer-icons-icon-design-avatar-flat-face-icon-5ab06e33bee962.122118601521511987782.jpg',
      chatRoom: window.location.pathname.split('/')[2],
    });
  });

  // clear image fields and hide share window
  imagePreviewer.removeChild(imagePreviewer.childNodes[0]);
  imageShareWindow.style.display = 'none';
  imageInputField.value = '';
});
