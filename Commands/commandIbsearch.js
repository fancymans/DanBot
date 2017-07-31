// Config file
var mpath = require('path');
var CONFIG = require(mpath.join(__dirname,'..','config.json'));

// HTTPS requests
var https = require("https");

// Sankaku Channel path
const API_KEY = CONFIG.ibsearch_api_key;
const IBSEARCH_PATH = "/api/v1/images.json?&limit=1&key=" + API_KEY;
const ERR_MEME = "\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE";

// Options for http requests
var options = {
    hostname: "ibsearch.xxx",
    path: IBSEARCH_PATH,
    port: 443,
    method: "GET",
    headers: {
        "Content-Type": "text/json",
    }
}

// Gets total number of results from request
function getRandomImageURL(tags) {
    return new Promise(function(resolve, reject) {
        // setup path
        options.path = IBSEARCH_PATH + "&q=";

        for (var i = 0; i < tags.length; ++i) {
            options.path += tags[i];
            options.path += "+";
        }

        options.path += "random:"

        var req = https.get(options, function(response) {
            console.log("getRandomImageURL - Response code: " + response.statusCode);
            if (Number(response.statusCode) >= 400) {
                reject("Request failed???\nResponse code: " + response.statusCode);
            } else {
                response.setEncoding("utf8");
                var jsonStr = "";   // will store the response

                // as data comes in, append it to jsonStr
                response.on("data", function(chunk) {
                    jsonStr += chunk;
                });

                // when request is done, resolve with url
                response.on("end", function() {
                    var jsonObj = JSON.parse(jsonStr);  // convert string to js object
                    if (jsonObj == null || jsonObj.length == 0) {
                        reject("No results found.")
                    } else {
                        var url = "https://" + jsonObj[0].server + ".ibsearch.xxx/" + jsonObj[0].path;
                        console.log(jsonObj[0].id);
                        resolve(url);
                    }
                });
            }
        });
   });
}

// Sends URL of image to Discord channel
function respondToCommand(channel, msg) {
    channel.sendMessage(msg);
}

/* --------------------------------------------------------
 *  function - Promise Resolution
 * --------------------------------------------------------
 *
 * This function is expected to be used externally (in a different script).
 * Determines a random media to retreive from Ibsearch, gets the URL of the media, and responds to the channel that requested it.
 * 
 * @param {IChannel} channel - the discord channel that sent the command.
 * @param {String[]} tags - an array of strings that contain image search tags
 */
function run(channel, author, tags) {
    getRandomImageURL(tags).then(function(result) {
        console.log("URL: " + result);
        console.log("-----------------------");
        var url = "Ayyy ( ͡º ͜ʖ ͡º)  🍆\n" + result;
        respondToCommand(channel, url);
    }, function(err) {
        err += ERR_MEME;
        respondToCommand(channel, err);
    });
}

module.exports = function() {
    return {
        Command: "ib",
        Description: "Searches the IB site for content based on given tags",
        Function: run,
    }
}
