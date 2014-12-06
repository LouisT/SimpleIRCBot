# Simple JavaScript IRC Bot (v0.0.1)
*I've had multiple people ask about [my] IRC bot, so I decided it would be easier to write an example. This is nowhere near as "feature rich" as my personal IRC bot, but it could be a decent place for new [Node.js] users to start. If you need/want help using or editing this, feel free to [contact me]. As always, pull requests are welcomed. This project is [UNLICENSED]!*

#####Requirements:
***
- [Node.js] - Developed using **v0.10.33**, no reason it shouldn't work on lower versions.
- [Git] - Used to download the source. You COULD  just download it [here].
- Faith in [my] coding ability.

#####Install & Configure & Run:
***
```sh
$ git clone git@github.com:LouisT/SimpleIRCBot.git SimpleIRCBot && cd SimpleIRCBot
$ editor config.js # Edit config.js with your favorite editor.
$ node index.js # See ./examples/ for more ideas.
```

#####Functions
***
* Obj.nick(nickname) - Change bot bot nickname. Automatically replaces all `?`'s with a random number.
* Obj.say(location, message [,notice]) - Send < message > to < location >. Optionally send it as a notification. mIRC text styling is supported
 * $c\d\d(,\d\d) - Color codes. (Markdown does not support text colors!)
 * $b            - **Bold text.**
 * $u            - Underline text. (Markdown does not support underline!)
 * $i            - _Italic text._
 * $o            - Remove text all styles.
* Obj.notice(location, message) - Alias to Obj.say(location, message, true).
* Obj.join(channels) - Join a channel. Pass an Array for multiple channels.
* Obj.part(channels) - Part a channel. Pass an Array for multiple channels.


#####Better README coming... eventually!


[Node.js]:http://node.js.org/
[Git]:http://git-scm.com/
[contact me]:https://ltdev.im/contact/
[UNLICENSED]:http://unlicense.org/
[my]:https://ltdev.im/
[here]:https://github.com/LouisT/SimpleIRCBot/archive/master.zip
