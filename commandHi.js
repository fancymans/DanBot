function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var responses = [
    "Wsup.",
    "Nigga who you is?",
    "How hops it? <- lmao dafuq does that even mean?",
    "Namaste.",
    "Allô!",
    "Si, fly.",
    "**HI. MY NAME IS DAN.**\nI am definitely not Darrin, but Darrin is definitely me.",
    "Greetings Lab Member " + getRandomIntInRange(100, 999) + ". _**El. Psy. Kongroo.**_"
];

module.exports = function(channel, author) {
    var randNum = getRandomInt(responses.length);
    channel.sendMessage(responses[randNum]);
}
