# KhaBot
Simple Discord bot for Kha'Zix mains.
The bot uses Node.JS and the [Discord.js](https://discord.js.org) framework.

#Discord
[Here](https://discord.gg/pHzbA6W) you can see how KhaBot works.

#Functionalities
Main purpose of this bot is managing the streamers - whenever someone starts streaming, the Live Stream role is assigned.
For it to work like it's supposed to be, you need to:
* create a role which you want to automatically assign to people who start live stream
* check the "Display this role separately from online members" option
* put KhaBot *above* this role - this gives him permissions to assign this role to streamers

#Other commands
``kha!help`` shows you the full list of commands that KhaBot has. You can also add your own commands - although only simple ones, 
where bot reacts with a text reply to a keyword. To do so, use the ``kha!add <keyword>|<content>|<(optional)description>`` command.
To remove a command created that way, use the ``kha!remove <keyword>`` command.

#Needed permissions
* Manage Roles
* Send Mesages
* Read Message History
* Read Messages
* Embed Links
