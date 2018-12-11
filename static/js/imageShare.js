let imageShareWindow = document.getElementById('img-share');
let imageShareButton = document.getElementById('image-share-button');
let cancelImageShareButton = document.getElementById('cancel-image-share');
let imageSubmitButton = document.getElementById('image-submit-button')
let imageInputField = document.getElementById('image-input-field');
let imagePreviewer = document.getElementById('image-preview');
let img = document.createElement('img');


// for opening share window 
imageShareButton.addEventListener('click', e => {
    e.preventDefault();
    imageShareWindow.style.display = 'block';
})

// for canceling image sharing
cancelImageShareButton.addEventListener('click', e => {
    imageShareWindow.style.display = 'none';
})

// to load preview image as soon as file selected
imageInputField.addEventListener('change', e => {
    toDataURI(imageInputField, e => {
        img.src = e;
        imagePreviewer.appendChild(img);
        img = document.createElement('img');
    });
})

// share and emit event 
imageSubmitButton.addEventListener('click', e => {
    toDataURI(imageInputField, uri => {
        socket.emit('chat', {
            type: 'image',
            name: getCookie('username'),
            imgSrc: uri,
            time: Date.now(),
            avatar: faker.image.avatar()
        });
    });

    // clear image fields and hide share window
    imagePreviewer.removeChild(imagePreviewer.childNodes[0]);
    imageShareWindow.style.display = 'none';
    imageInputField.value = '';
    console.log("IMAGE PREV ", imagePreviewer.src)
})


// converts image to base64 uri
const toDataURI = (fileInput, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = () => {
        cb(reader.result);
    };
}
