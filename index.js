/*
  Make sure the bot runs from the correct directory.
     (Fix using require(), loading plugins, etc.)   
*/
if (process.cwd() !== __dirname) {
   console.log('Attempting to switch directory... '+process.cwd()+' -> '+__dirname);
   try {
      process.chdir(__dirname);
      if (process.cwd() !== __dirname) {
         console.log('Switching directory failed...');
         process.exit(1);
      }
      console.log('Switch successful.');
    } catch (err) {
      console.trace(err);
      process.exit(1);
   }
}

/*
 Quick example of the 'Bot' lib.
*/
var bot = require('./libs/bot'),
    conf = require('./config');

var Bot = bot(conf.irc).connect();

Bot.on('001',function () { // Bot connected.
    this.join(conf.irc.channels);
});

Bot.on('433',function () { // Nick in use.
    this.nick('Simple????');
});

Bot.on('join',function (user,chan) { // The bot or another user has joined a channel.
    if (user[1] == this.irc.botnick) {
       this.say(chan,'Hello! This is just a dumb bot.');
     } else {
       this.say(chan,'Hello, '+user[1]+'! This is just a dumb bot.');
    };
});

Bot.on('part',function (user, chan) { // A user has left the channel.
    if (user[1] !== this.irc.botnick) {
       this.say(chan,'Oh... I hope '+user[1]+' joins again.');
    }
});

Bot.on('quit',function (user, chan) { // A user has left the IRC server.
    if (user[1] !== this.irc.botnick) {
       this.say(chan,'Oh... Farewell '+user[1]+', I will miss you.');
    }
});

/*
  Become a stupid parrot bot...
*/
Bot.on('privmsg',function (user, chan, exp) { // Someone has messaged a channel or the bot.
    this.say(chan||user[1],user[1]+': $c04'+exp.slice(3).join(' ').replace(/^:/,''));
});


/*
  This is dumb... You probably shouldn't rely on this.
  Try catching errors for real, this is just for my examples!
*/
process.on('uncaughtException', function(err) {
    var date = (date = new Date()).toDateString()+' ('+date.toLocaleTimeString()+')';
    console.log('\n\n----- TRACE START '+date+' -----\n');
    console.trace(err);
    console.log('\n----- TRACE END '+date+' -----\n\n');
});

