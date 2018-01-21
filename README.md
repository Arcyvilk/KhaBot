# KhaBot
Simple Discord bot for Kha'Zix mains.
The bot uses Node.JS and the [Discord.js](https://discord.js.org) framework.

# Discord
[Here](https://discord.gg/pHzbA6W) you can see how KhaBot works.

# Functionalities
## Managing streamers 
Whenever someone starts streaming, bot assigns a Live Stream role to them. For it to work like it's supposed to be, you need to:
* create a role which you want to automatically assign to people who start live stream
* check the "Display this role separately from online members" option
* put KhaBot *above* this role - this gives him permissions to assign this role to streamers
## Default commands
* ``kha!help`` - shows  the full list of commands that KhaBot has
* ``kha!add <keyword>|<content>|<(optional)description>`` - adds your own commands - although only simple ones, where bot reacts with a text reply to a keyword
* ``kha!remove <keyword>`` - removes custom command (can't remove default ones)
* ``kha!streamrolename <stream_role_name>`` - changes the role supposed to showcase the live streamers (case sensitive)
## Reactions
Bot uses reactions to let you know if he could execute the command:
* ✅ - command succesfully executed
* ⚠️ - something went wrong
* 🚫 - user doesn't have permissions to perform this command

# Needed permissions
* Manage Roles - to be able to add the Live Stream role
* Add Reactions - bot uses reactions to let you know if he could execute the command
* Send Messages
* Read Message History
* Read Messages
* Embed Links
