const toggleButton__div = document.querySelector('a');
const login__div = document.querySelector('#login');
const signup__div = document.querySelector('#signup');
const loginInstead__div = document.querySelector('#login-instead');
const signupInstead__div = document.querySelector('#signup-instead');
const forgotPassword__div = document.querySelector('#forgot-password');
const forgotPasswordForm__div = document.querySelector('#forgot-password-form');
const backToLogin__div = document.querySelector('#back-to-login');
const formMessageContainer__div = document.querySelectorAll('.message-box'); // [0] -> login; [1] -> signup; [2] -> reset password
const closeModel__button = document.querySelectorAll('.model .action .close');

const toggleForm = () => {
  login__div.classList.toggle('show');
  signup__div.classList.toggle('show');
  forgotPasswordForm__div.classList.remove('show');
};

forgotPassword__div.onclick = () => {
  login__div.classList.remove('show');
  signup__div.classList.remove('show');
  forgotPasswordForm__div.classList.add('show');
};

backToLogin__div.onclick = () => {
  login__div.classList.add('show');
  signup__div.classList.remove('show');
  forgotPasswordForm__div.classList.remove('show');
};

loginInstead__div.onclick = toggleForm;
signupInstead__div.onclick = toggleForm;

/** Close any open model on clicking `close` button */
closeModel__button.forEach(c => {
  c.addEventListener('click', () => {
    const elementToHide = document.querySelector(`#${c.classList[1]}`);
    const elementToHide__content = document.querySelector(
      `#${c.classList[1]} > .model-content-wrapper`
    );

    elementToHide.classList.add('hide');
    elementToHide__content.classList.add('hide');
  });
});

/** Handle SignUp form submission */
const signUpForm = signup__div.childNodes[1];

signUpForm.addEventListener('submit', e => {
  e.preventDefault();

  const formData = JSON.stringify({
    name: signUpForm.elements['name'].value,
    email: signUpForm.elements['email'].value,
    password: signUpForm.elements['password'].value,
  });

  fetch('/signup', {
    body: formData,
    method: 'POSt',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(data => data.json())
    .then(data => {
      if (data.code === 100) {
        const verifyEmailModel = document.querySelector('#verifyEmailModel');
        const verifyEmailModel__content = document.querySelector(
          '#verifyEmailModel .model-content-wrapper'
        );
        // show the email verification model
        verifyEmailModel.classList.remove('hide');
        verifyEmailModel__content.classList.remove('hide');

        // show success message
        // signInForm.elements['email'].value = signUpForm.elements['email'].value;
        // signInForm.elements['password'].value =
        //   signUpForm.elements['password'].value;
        // formMessageContainer__div[0].innerText = `Please Login`;
        // formMessageContainer__div[0].classList.add('info-message');
        // formMessageContainer__div[0].classList.remove('error-message');
        // formMessageContainer__div[0].classList.remove('hide');
        loginInstead__div.click();
      } else {
        formMessageContainer__div[1].innerText = data.message;
        formMessageContainer__div[1].classList.remove('info-message');
        formMessageContainer__div[1].classList.add('error-message');
        formMessageContainer__div[1].classList.remove('hide');
      }
    })
    .catch(console.log);
});

/** Handle SignIn form Submission */
const signInForm = login__div.childNodes[1];

signInForm.addEventListener('submit', e => {
  e.preventDefault();

  const formData = JSON.stringify({
    email: signInForm.elements['email'].value,
    password: signInForm.elements['password'].value,
  });

  fetch('/signin', {
    body: formData,
    method: 'POSt',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(data => data.json())
    .then(data => {
      console.log(data);
      if (data.code === 100) {
        location.replace('/room/general');
      } else {
        formMessageContainer__div[0].innerText = data.message;
        formMessageContainer__div[0].classList.remove('info-message');
        formMessageContainer__div[0].classList.add('error-message');
        formMessageContainer__div[0].classList.remove('hide');
      }
    })
    .catch(console.log);
});
