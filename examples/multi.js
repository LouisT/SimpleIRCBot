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
 Quick example of the 'Bot' lib, allowing multiple IRC connections.
 Please note, this will attempt to create 5 bots.
 Most IRC networks will limit your connections to about 3.
 This is done to display an example for failing connections!
*/
var bot = require('../libs/bot'),
    conf = require('../config'),
    bots = []; // Hold all the bots in here.

for (var x = 0; x <= 4; x++) { // Create 5 bots, hopefully throw some errors.
    setTimeout(function() { // Make sure to stagger connections, don't need to be throttled!
       var Bot = bot(conf.irc).connect();

       Bot.on('001',function () {
           console.log('Bot connected.');
           this.join(conf.irc.channels);
       });

       Bot.on('433',function () {
           console.log('Nickname in use!');
           this.nick('Simple????');
       });

       Bot.on('join',function (user,chan) {
           if (user[1] == this.irc.botnick) {
              this.say(chan,'Hello! This is just a dumb bot.');
            } else {
              this.say(chan,'Hello, '+user[1]+'! This is just a dumb bot.');
           };
       });

       bots.push(bot);
   },x*1000);
};


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
