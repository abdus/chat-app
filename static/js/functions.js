const tts = message => {
    if (!message.startsWith('/tts ')) return;
    message = message.slice(4);
    responsiveVoice.speak(message, "UK English Male");
    console.log(message);
    return message;
}