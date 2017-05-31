# DanBot
Just some dumb discord bot. You can use my code to build your own bot too.

----

### Requirements
[Nodejs](https://nodejs.org/en/) installed.

If you don't know whether or not Nodejs is installed, type ```node -v``` into your terminal. If you get a version number back then it is installed.

----

### To run
1. Make sure you are in the project directory
2. Enter into terminal/console: 
    
    ```node .```
    
    or 
    
    ```node index.js```

----

### The bot won't connect to Discord?
If you want to run or test locally, you will need to update `./index.js` with your own Discord client token and change the value of 

```javascript
const CLIENT_TOKEN = CONFIG.client_token;
```

to...

```javascript
const CLIENT_TOKEN = "whatever-your-token-is";
```

***Keep in mind the token needs to be in a string format.*** If you're just copying and pasting your token in, you will need to put double quotes around it (as shown above).

Alternatively, you can [create a config.json file](#what-is-configjson) to hold the client token. 

----

### Ibsearch isn't working?
This is the API key isn't provided. You can [get your own API key](https://ibsearch.xxx/api/) for free from Ibsearch.

Once you have your own API key, you'll need to update the `const API_KEY` value in `./commandIbsearch.js`

```javascript
const API_KEY = CONFIG.ibsearch_api_key;
```

to...

```javascript
const API_KEY = "whatever-your-api-key-is";
```

***Keep in mind the api key needs to be in a string format.*** If you're just copying and pasting your token in, you will need to put double quotes around it (as shown above).

----

### What is config.json?
It's my untracked json file that holds sensitive information (like the client token or any API keys). I recommend you keep your own sensitive information in a separate file too.

Here is an example:

```json
{
    "client_token": "whatever-your-token-is",
    "ibsearch_api_key": "whatever-your-api-key-is"
}
```
