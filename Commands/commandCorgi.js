// HTTPS requests
var https = require("https");

// Reddit path
const CORGI_PATH = "/r/pics.json";
const ERR_MEME = "\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE";

// Options for Rule 34 http requests
var search_options = {
    hostname: "reddit.com",
    path: CORGI_PATH,
    port: 443,
    method: "GET",
    headers: {
        "Content-Type": "text/json"
    }
}

function getRandomImage(url) {

    return new Promise(function(resolve,reject) {

        var req = https.get(url, function(response) {
            var data = "";
            if (Number(response.statusCode == 302 )) {
                resolve(getRandomImage(response.headers.location));
            } else if (Number(response.statusCode >= 400)) {
                reject("Request failed???\nResponse code: " + response.statusCode);
            } else {
                response.on("data", function(chunk) {
                    if (chunk) {
                        data += chunk;
                    }
                });

                response.on("end", function() {
                    resolve(JSON.parse(data));
                })
            }
        })

    })

}

function checkForImage(channel) {
    getRandomImage("https://www.reddit.com/r/corgi/random.json").then(function(result) {
        if (result) {
            var redditdata = result[0].data.children[0].data
            if (redditdata["url"]) {
                console.log(redditdata.url);
                channel.sendMessage(redditdata.url);
            } else {
                console.log('fail');
                checkforImage();
            }
        }
    })
}

module.exports = function(channel) {
    return {
        Command: 'corgi',
        Description: 'Pulls a random image from r/corgi',
        Function: checkForImage,
    }
}