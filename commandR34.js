// HTTPS requests
var https = require("https");

// XML -> JSON converter
var parseString = require("xml2js").parseString;

// Rule 34 path
const R34_PATH = "/index.php?page=dapi&s=post&q=index&limit=1";
const ERR_MEME = "\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE\nBLAME DAN'S SHIT CODE";

// Rule 34 PID limit -- they won't let us query any post with a PID over this amount
const PID_LIMIT = 200000;

// Options for Rule 34 http requests
var r34_options = {
    hostname: "rule34.xxx",
    path: R34_PATH,
    port: 443,
    method: "GET",
    headers: {
        "Content-Type": "text/xml"
    }
}

/* --------------------------------------------------------
 *  r34_getResultCount
 * --------------------------------------------------------
 * Gets total number of results from a Rule 34 query.
 * 
 * @param {String[]} tags - an array of strings that contain image search tags
 */
function r34_getResultCount(tags) {
    return new Promise(function(resolve, reject) {
        // setup path
        r34_options.path = R34_PATH;

        // check if there are tags before appending tags
        if (tags.length > 0) {
            r34_options.path += "&tags=";

            for (var i = 0; i < tags.length; ++i) {
                r34_options.path += tags[i];
                if (i < tags.length - 1) {
                    r34_options.path += "+";
                }
            }
        }

        console.log("Query options: " + r34_options.path);

        var req = https.get(r34_options, function(response) {
            console.log("r34_getResultCount - Response code: " + response.statusCode);
            if (Number(response.statusCode) >= 400) {
                reject("Request failed???\nResponse code: " + response.statusCode);
            } else {
                response.setEncoding("utf8");
                var xml = "";   // will store the response

                // as data comes in, save it in xml
                response.on("data", function(chunk) {
                    xml += chunk;
                });

                // when request is done, parse xml for the number of results
                response.on("end", function() {
                    parseString(xml, function (err, result) {
                    /* -------------------------------------------------- 
                     * Rule34 only allows up to 100 results per request.
                     * By limiting it to 1 result per request, we ensure 
                     * that the resultCount is aligned with the amount 
                     * of pages.
                     * ------------------------------------------------*/
                        var resultCount = result.posts["$"].count;
                        if (resultCount <= 0) {
                            reject("No results found.");
                        } else {
                            console.log("r34_getResultCount - XML Results\n:" + xml);
                            resolve(resultCount);
                        }
                    });
                });
            }
        });
    });
}

/* --------------------------------------------------------
 *  r34_getRandomImageURL
 * --------------------------------------------------------
 * Gets URL of a random image (or other media) from Rule34.
 * 
 * @param {Number} imgCount - the amount of images to choose from
 */
function r34_getRandomImageURL(imgCount) {
    return new Promise(function(resolve, reject) {
        // ensure the imgCount is within PID max limit
        if (imgCount > PID_LIMIT) {imgCount = PID_LIMIT;}

        // setup path
        var randomPID = Math.floor(Math.random() * imgCount);
        r34_options.path += ("&pid=" + randomPID);
        console.log("Rule 34 media query path: " + r34_options.path);

        var req = https.get(r34_options, function(response) {
            console.log("r34_getRandomImageURL - Response code: " + response.statusCode);

            if (Number(response.statusCode) >= 400) {
                // If the response sends back an error, reject the promise
                reject("Request failed???\nResponse code: " + response.statusCode);
            } else {
                response.setEncoding("utf8");
                var xml = "";   // will store the response
                
                // as data comes in, save it in xml
                response.on("data", function(chunk) {
                    xml += chunk;
                });

                // when request is done, convert the xml to json
                response.on("end", function() {
                    parseString(xml, function (err, result) {
                        // Save URL
                        console.log("r34_getRandomImageURL - XML Results\n:" + xml);

                        if (result.posts == null) {
                            reject("Post came back null.");
                        }

                        var url = result.posts.post[0]["$"].file_url;

                        if (url == null || url == "") {
                            reject("Failed to get image.");
                        } else {
                            resolve("https:" + url);
                        }
                    });
                });
            }
        });
    });
}

/* --------------------------------------------------------
 *  respondToCommand
 * --------------------------------------------------------
 * Sends URL of image to Discord channel.
 * 
 * @param {IChannel} channel - the discord channel that sent the command.
 * @param {String} msg - a text message to be sent to the channel.
 */
function respondToCommand(channel, msg) {
    channel.sendMessage(msg);
}

/* --------------------------------------------------------
 *  function - Promise Resolution
 * --------------------------------------------------------
 *
 * This function is expected to be used externally (in a different script).
 * Determines a random media to retreive from Rule 34, gets the URL of the media, and responds to the channel that requested it.
 * 
 * @param {IChannel} channel - the discord channel that sent the command.
 * @param {String[]} tags - an array of strings that contain image search tags
 */
module.exports = function(channel, tags) {
    // "r34_getResultCount" made a promise to finish
    r34_getResultCount(tags).then(function(result) {
        // Promise is resolved
        console.log("Count: " + result);
        console.log("-----------------------");
        return r34_getRandomImageURL(result);
    }, function(err) {
        // Promise was rejected
        throw(err);
    })
    // "r34_getRandomImageURL" made a promise to finish
    .then(function(result) {
        // Promise is resolved
        console.log("URL: " + result);
        console.log("-----------------------");
        var msg = "Ayyy ( ͡º ͜ʖ ͡º)  🍆\n" + result;
        respondToCommand(channel, msg);
    }, function(err) {
        // Promise was rejected
        err += ERR_MEME;
        respondToCommand(channel, err);
    });
}
