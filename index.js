// Config file
var CONFIG = require("./config.json");
const CLIENT_TOKEN = CONFIG.client_token;

var Discordie = require("discordie");
var client = new Discordie();
const CMD_PREFIX = "?";	// all commands have to start with this as a prefix

var fs = require('fs');
var path = require('path');

client.connect({token: CLIENT_TOKEN});

client.Dispatcher.on("GATEWAY_READY", e => {
	console.log("Connected as: " + client.User.username);
});

// check when a message is created and perform some action
client.Dispatcher.on("MESSAGE_CREATE", e => {
	if (commandReceived(e.message)) {
		var channel = client.Channels.get(e.message.channel_id);				// ID of the channel
		var author = e.message.author;											// Person who issued command
        var command = e.message.content.split(" ");                             // Split message by words and store in array
        command[0] = command[0].substr(1, command[0].length);                   // Remove command prefix
		
		queryCommand(channel, author, command);
	}
});

// check prefix of message to match command prefix
function commandReceived (message) {
	if (message.content.length > 1 && 
        message.content.substr(0, 1) == CMD_PREFIX) {
		console.log("Request command received from User: " + message.author.username);
		return true;
	}
	return false;
}

// check if channel is named nsfw
function isNSFW (channel) {
    if (channel.name.includes('nsfw')) {
        return true;
    } else {
        channel.sendMessage('This command can only be used in the NSFW channel');
        return false;
    }
}

// searches for a command that matches and calls it
/*function queryCommand (channel, author, command) {

    switch(command[0]) {
        case "afternoon":
        case "allo":
        case "bonjour":
        case "evening":
        case "goodafternoon":
        case "goodevening":
        case "goodmorning":
        case "greet":
        case "greetings":
        case "hello":
        case "hi":
        case "hola":
        case "konnichiwa":
        case "konbanwa":
        case "morning":
        case "ohio":
        case "sup":
        case "wsup":
        case "yo":
            var performCommand = require("./commandHi.js");
            performCommand(channel, author);
            break;

        case "dan":
            var performCommand = require("./commandDan.js");
            performCommand(channel, author);
            break;

        case "ib":
            if (isNSFW(channel)) {
                var args = getArgs(command);
                var performCommand = require("./commandIbsearch.js");
                performCommand(channel, args);
            }
            break;

        case "r34":
            if (isNSFW(channel)) {
                var args = getArgs(command);
                var performCommand = require("./commandR34.js");
                performCommand(channel, args);
            }
            break;

        default:
            channel.sendMessage("Uhh... wat do?");
    }
}*/
function queryCommand(channel, author, command) {
    var files = fetchCommandFiles();
    if (!files) {
        channel.sendMessage("Whoops, no commands found :(");
        return false;
    }
    for (var index = 0; index < files.length; index++) {
        var filename = path.basename(files[index]);
        var commandData = require("./Commands/" + filename)();
        if (command[0] == commandData.Command) {
            commandData.Function(channel,author,getArgs(command));
        }
    }
}

// Gets all command files
function fetchCommandFiles() {
    var files = fs.readdirSync('./Commands');
    if (files) { return files };
    console.log("No commands found");
}

// Gets arguments from input
function getArgs(input) {
    var args = [];
    for (var i = 1; i < input.length; ++i) {
        // console.log("Arg " + i + ": " + input[i]);
        args.push(input[i]);
    }
    return args;
}
