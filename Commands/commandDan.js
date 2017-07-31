const DANID = 272668594301566976;

function isDan(user) {
    return user.id == DANID ? user : null;
}

function run(channel, author) {
    var guild = channel.guild;
    var members = guild.members;
    var selfieURL = "";

    var hopefullyDan = members.find(isDan);
    if (hopefullyDan) {
        selfieURL = hopefullyDan.avatarURL;
    }
    
    channel.sendMessage("**HI./ mY NAME ISd DAN.**\n" + 
                        "MY FIRENDs TELl ME IM GOOD AT SAERCHINg PORN.\n" + 
                        "🤖🤖🤖\n" + selfieURL);
}

module.exports = function(channel, author) {
    return {
        Command: "test",
        Description: "Run it and find out",
        Function: run
    }
}