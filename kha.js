const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.TOKEN;
const fs = require(`fs`);
const trigger = `kha!`
var settings = {
    cmd: {}
};

bot.login(token);
bot.on('ready', () => {
    fs.readFile('settings.json', 'utf8', (err, data) => {
        if (err)
            return;
        settings = JSON.parse(data);
        fs.readFile('commands.json', 'utf8', (err, data) => {
            if (err)
                return;
            settings.cmd = JSON.parse(data);
            console.log(`Kha'Zix bot is ready to use!`);
        });
    });
});
bot.on('message', message => {
    var command = message.content;

    if (command.startsWith(trigger)) {
        var keyword = extractKeyword(command);
        if (message.channel.id != message.author.id && commandExists(keyword)) {
            command = settings.cmd[keyword];
            if (settings.cmd[keyword].modOnly && !message.member.permissions.has('ADMINISTRATOR'))
                return message.react('🚫');
            message.channel.send(appropriatelyToType(command, message));
        }
    }
});
bot.on('presenceUpdate', (oldMember, newMember) => {
    var streamRoleID = '0';
    var streamRoleName = settings.streamRoleName;

    if (newMember.presence.game && newMember.presence.game.url) {
        streamRoleID = newMember.guild.roles.find(role => role.name === streamRoleName);
        if (streamRoleID)
            streamRoleID = streamRoleID.id;
        newMember.addRole(streamRoleID)
            .then(success => { })
            .catch(error => console.log(`- add streaming role to ${newMember.user.username} - ${error}`));
    }
    if (!newMember.presence.game || !newMember.presence.game.url) {
        streamRoleID = newMember.guild.roles.find(role => role.name === streamRoleName);
        if (streamRoleID)
            streamRoleID = streamRoleID.id;
        newMember.removeRole(streamRoleID)
            .then(success => { })
            .catch(error => console.log(`- rmv streaming role from ${newMember.user.username} - ${error}`));
    }
});

function appropriatelyToType(command, message) {
    if (command.type == `text`)
        return command.reply;
    if (command.type == `function`)
        return functions[command.reply](message);
};
function extractKeyword(command) {
    var k = command.replace(trigger, ``).trim().toLowerCase();
    k = k.split(' ');
    return k[0].trim();
};
function commandExists(keyword) {
    return (settings.cmd.hasOwnProperty(keyword));
};

///---------------------------------------------------------------------------------------------------
///---------------------------------------  FUNCTION COMMANDS  ---------------------------------------
///---------------------------------------------------------------------------------------------------

var functions = {
    help: function help(msg) {
        var listNormal = `**Standard commands**\n`;
        var listMod = `**Moderation commands**\n`;

        for (keyword in settings.cmd) {
            if (settings.cmd[keyword].modOnly) {
                listMod += ` - __${keyword}__`;
                if (settings.cmd[keyword].desc)
                    listMod += ` - ${settings.cmd[keyword].desc}`;
                listMod += `\n`;
            }
            else {
                listNormal += ` - __${keyword}__`;
                if (settings.cmd[keyword].desc)
                    listNormal += ` - ${settings.cmd[keyword].desc}`;
                listNormal += `\n`;
            }
        }
        return listNormal + listMod;
    },
    add: function add(msg) {
        var m = msg.content.substring(msg.content.indexOf(' ')).trim();

        if (m.indexOf('|') == -1)
            return `:warning: Wrong syntax! \n\`\`kha!addcommand <keyword>|<content>|<decription (optional)>\`\``;
        m = m.split('|');
        if (m[0] == "" || m[1] == "")
            return `:warning: Invalid keyword or content.`;
        if (settings.cmd.hasOwnProperty(m[0].trim()))
            return `:warning: Command **${m[0].trim()}** already exists.`;
        settings.cmd[m[0].trim()] = {
            "type": "text",
            "reply": m[1].trim(),
            "desc": m[2],
            "modOnly": false
        };
        fs.writeFile("commands.json", JSON.stringify(settings.cmd), err => {
            if (err)
                return msg.react('⚠️');
            return msg.react('✅');
        });
    },
    remove: function remove(msg) {
        var m = msg.content.substring(msg.content.indexOf(' ')).trim();

        if (!settings.cmd.hasOwnProperty(m))
            return `:warning: Command **${m}** doesn't exist.`;
        if (settings.cmd[m].type == 'function')
            return `:warning: Command **${m}** cannot be removed!`;
        delete settings.cmd[m];
        fs.writeFile("commands.json", JSON.stringify(settings.cmd), err => {
            if (err)
                return msg.react('⚠️');
            return msg.react('✅');
        });
    }
}