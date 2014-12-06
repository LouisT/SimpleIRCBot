/*
  Simple JavaScript IRC bot. - By Louis T. < https://ltdev.im/ >
*/
var events = require('events'),
    net = require('net'),
    tls = require('tls'),
    util = require('util');

/*
  Create a Bot() object to add prototypes to.
*/
function Bot (config) {
         if (!(this instanceof Bot)) { // If it's not an instance, make it one.
            return new Bot(config);
         };
         events.EventEmitter.call(this);
         this.irc = {                            // Store IRC information here, such as users and channels.
              users: [],                         // An Object might be better, but protect against __proto__ injection!
              channels: {},                      // No need to protect against __proto__ injection from channel names.
              buffer: '',                        // Empty var to buffer IRC data.
              botnick: null,                     // Store the bot nickname here.
         };
         this.config = config||{                 // Store a default configuration somewhere.
              nickname: 'Simple????',            // Any `?`s will be replaced with a random number.
              server: {
                   server: 'irc.voltirc.net',    // Default IRC server.
                   port:   6667,                 // Default IRC port, usually 6667 everywhere.
              },
              debug: 1
         };
         this.on('ping',function(source) {
              this.raw('PONG :'+source);
         });
         return this;
}
util.inherits(Bot,events.EventEmitter);

/*
  Create a connection to the chosen IRC server.
  You can manage multiple IRC servers by pushing multiple Bot()'s to an array.
*/
Bot.prototype.connect = function () {
         var self = this;
         self.opts = { // Some defaults in case you leave one or more out of the configuration.
              port: (('port' in self.config.server)?self.config.server.port:6667),
              host: (('address' in self.config.server)?self.config.server.address:'irc.voltirc.net'),
         };
         self.socket = (!self.config.ssl?net:tls).connect(self.opts,function () {
              var packet = [
                  'NICK '+(self.config.nickname||'Simple????').replace(/\?/g,function(){return ~~(Math.random()*9);}),
                  'USER '+(self.config.username||'Simple')+' * * :'+(self.config.realname||'Simple JavaScript IRC bot. - < https://ltdev.im/ >')
              ];
              if (('password' in self.config.server)) {
                 packet.unshift('PASS '+config.server.password); // Push the server password to the front of the packet.
              }
              self.raw(packet.join('\n'));
         });
         self.socket.on('data',function(data) {
              self.socket.setTimeout(180000);
              self.buffer(data);
         });
         return this;
}

/*
  Send full IRC strings to the server.
*/
Bot.prototype.raw = function (data, nocolor) {
         var self = this;
         if (('socket' in self) && self.socket.writable) {
            if (nocolor) {
               var output = data.replace(/\$(\$|c(\d{1,2}(,\d{1,2})?)?|b|u|o|i)/g,'');
             } else {
               var output = data.replace(/\$(\$|c|b|u|i|o)/g,function(a,b){
                   return {'$':'$','c':"\x03",'b':"\x02",'u':"\x1F",'o':"\x0F",'i':"\x1D"}[b];
               });
            }
            self.socket.write(output+'\n', 'utf8', function() {
               if (self.config.debug) {
                  console.log('O -> '+data);
               }
            });
          } else {
            if (self.config.debug) {
               console.log('E -> Socket not writable!');
            }
         }
         return this;
}

/*
  Simple prototypes for random commands.
*/
Bot.prototype.nick = function (nick) {
        return this.raw('NICK '+(this.irc.botnick = (nick||'Simple????').replace(/\?/g,function(){return ~~(Math.random()*9);})));
}
Bot.prototype.say = function (loc, msg, notice) {
        return this.raw((notice?'NOTICE':'PRIVMSG')+' '+loc+' :'+msg);
}
Bot.prototype.notice = function (loc, msg) {
        return this.say(loc, msg, 1);
}
Bot.prototype.join = function (channels) {
        return this.raw('JOIN '+(typeof channels == 'array'?channels.join(','):channels));
}
Bot.prototype.part = function (channels) {
        return this.raw('PART '+(typeof channels == 'array'?channels.join(','):channels));
}

/*
  Buffer all messages from IRC, then pass
  the result to Bot.parse to read them.
*/
Bot.prototype.buffer = function (data) {
         this.irc.buffer += data.toString();
         while (this.irc.buffer) {
               var offset = this.irc.buffer.search(/\r?\n/);
               if (offset < 0) {
                  return;
               }
               var message = this.irc.buffer.substr(0,offset);
               this.irc.buffer = this.irc.buffer.substr(offset+2);
               if (this.config.debug) {
                  console.log('I -> '+message);
               }
               this.parse(message);
         }
         return this;
}

/*
  Parse each IRC message and pass to the emitter.
*/
Bot.prototype.parse = function (data) {
         var exp = data.split(' '), match, user;
         if (exp.length > 1) {
            /*
              Reply to PING requests automatically.
            */
            switch (exp[0].toLowerCase()) {
                   case 'ping':
                        this.emit('ping',(exp[1]?exp[1].replace(/:/,''):'PONG'));
                        return this;
            }

            var user = (exp[0] && (user = exp[0].replace(/:/,'').match(/^([^!]+)!([^@]+)@(.+)[^ ]$/)));
            var chan = ((match = String(exp[2]).match(/^:?#[^\x07\x2C\s]{0,200}$/))?String(match[0]).toLowerCase().replace(/^:/,''):false);

            switch (String(exp[1]).toLowerCase()) {
                   case '001': 
                        this.irc.botnick = exp[2];
                   default:
                        /*
                          Emit every IRC command. Add more cases to change the specifics of data you emit.
                          Useful for things like join, part, quit, nick etc.
                        */
                        this.emit(String(exp[1]).toLowerCase(), user, chan, exp, data);
            }
         }
         return this;
}

/*
  Make sure to export Bot, otherwise this is useless!
*/
module.exports = Bot;
