/*
  Simple JavaScript IRC bot. - By Louis T. < https://ltdev.im/ >

  You can use specify other configuration information in here as well.
  Useful for things like plugins. See the `YouTube` block.
*/
module.exports = {
       irc: {
            nickname: 'Simple',                                               // Your bot nick.
            altnick:  'Simple????',                                           // Alternative nick in case `nickname` is taken.
            realname: 'Simple JavaScript IRC bot. - < https://ltdev.im/ >',   // Your bot's real name.
            channels: ['#Example','#Example2'],                               // Array of IRC channels to join on connect.
            server: {
                    address:  'irc.freenode.net',                             // The IRC server you wish to connect to.
                    port:     6667,                                           // The port you wish to connect to.
//                  password: 'server password',                              // This isn't usually needed, unless your server is password protected.
            },
            debug: 1,                                                         // Output ALL messages to console.
       },

       YouTube: {                                                             // A plugin! See the example `./examples/YouTube.js`
           enabled: true,
           regex:   /(?:https?:\/\/)?(?:.*\.)?youtu(?:\.be\/|be\.com\/(?:watch\?.*?v=)?)([^\?#&\s\[\]\(\)]+)/i,
       }
};

