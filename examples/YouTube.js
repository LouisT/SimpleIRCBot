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
var bot = require('../libs/bot'),
    conf = require('../config'),
    http = require('http');

var Bot = bot(conf.irc).connect();

Bot.on('001',function () { // Bot connected.
    this.join(conf.irc.channels);
}).on('433',function () { // Nick in use.
    this.nick('Simple????');
});

/*
  Example bot to pull YouTube video information.
*/
Bot.on('privmsg',function (user, chan, exp) { // Someone has messaged a channel or the bot.
    if (('YouTube' in conf && conf.YouTube.enabled)) {
       var input = exp.slice(3).join(' ').replace(/^:/,'');
       if ((match = input.match(conf.YouTube.regex))) {
          http.get('http://gdata.youtube.com/feeds/api/videos/'+match[1]+'?v=2&alt=json',function (res) {
             if (res.statusCode == 200) {
                var buffer = '';
                res.on('data', function (data) {
                   buffer += data;
                }).on('end',function () {
                   var parsed = JSON.parse(buffer);
                   this.say(chan,'[$b$u'+user[1]+'$b$u] YTID: $c04$b'+match[1]+'$c$b - Title: $c04$b'+parsed.entry.title['$t']);
                }.bind(this));
              } else {
                this.say(chan,'Invalid status code from YouTube. ('+res.statusCode+'/'+match[1]+')');
             }
          }.bind(this));
       }
    }
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

