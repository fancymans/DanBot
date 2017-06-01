function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// hi

module.exports = function(channel, author) {
    var responses = [
        "Wsup.",
        "Nigga who you is?",
        "How hops it? <- lmao dafuq does that even mean?",
        "Namaste.",
        "Allô!",
        "Si, fly.",
        "**HI. MY NAME IS DAN.**\nI am definitely not Darrin, but Darrin is definitely me.",
        "Greetings Lab Member " + author.discriminator + ". _**El. Psy. Kongroo.**_"
    ];

    var randNum = getRandomInt(responses.length);
    channel.sendMessage(responses[randNum]);
}
