const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.TOKEN;
const fs = require(`fs`);
const trigger = `kha!`
var cmd = {};

bot.login(token);
bot.on('ready', () => {
    fs.readFile('commands.json', 'utf8', (err, data) => {
        if (err)
            return;
        cmd = JSON.parse(data);
        console.log(`Kha'Zix bot is ready to use!`);
    });
});
bot.on('message', message => {
    var command = message.content;

    if (command.startsWith(trigger)) {
        var keyword = extractKeyword(command);
        if (message.channel.id != message.author.id && commandExists(keyword)) {
            command = cmd[keyword];
            if (cmd[keyword].modOnly && !message.member.permissions.has('ADMINISTRATOR'))
                return message.react('🚫');
            message.channel.send(appropriatelyToType(command, message));
        }
    }
});
bot.on('presenceUpdate', (oldMember, newMember) => {
    var streamRoleID = '0';
    var streamRoleName = 'Test';

    if (newMember.presence.status == 'dnd' && oldMember.presence.status != 'dnd') { //placeholder for streaming status
        streamRoleID = newMember.guild.roles.find(role => role.name === streamRoleName).id;
        newMember.addRole(streamRoleID)
            .then(a => console.log(`:) add ${a}`))
            .catch(e => console.log(`:( add ${e}`));
    }
    if (newMember.presence.status != 'dnd' && oldMember.presence.status == 'dnd') { //placeholder for streaming status
        streamRoleID = newMember.guild.roles.find(role => role.name === streamRoleName).id;
        newMember.removeRole(streamRoleID)
            .then(a => console.log(`:) rmv ${a}`))
            .catch(e => console.log(`:( rmv ${e}`));
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
    return (cmd.hasOwnProperty(keyword));
};

///---------------------------------------------------------------------------------------------------
///---------------------------------------  FUNCTION COMMANDS  ---------------------------------------
///---------------------------------------------------------------------------------------------------

var functions = {
    help: function help(msg) {
        var listNormal = `**Standard commands**\n`;
        var listMod = `**Moderation commands**\n`;

        for (keyword in cmd) {
            if (cmd[keyword].modOnly) {
                listMod += ` - __${keyword}__`;
                if (cmd[keyword].desc)
                    listMod += ` - ${cmd[keyword].desc}`;
                listMod += `\n`;
            }
            else {
                listNormal += ` - __${keyword}__`;
                if (cmd[keyword].desc)
                    listNormal += ` - ${cmd[keyword].desc}`;
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
        if (cmd.hasOwnProperty(m[0].trim()))
            return `:warning: Command **${m[0].trim()}** already exists.`;
        cmd[m[0].trim()] = {
            "type": "text",
            "reply": m[1].trim(),
            "desc": m[2],
            "modOnly": false
        };
        fs.writeFile("commands.json", JSON.stringify(cmd), err => {
            if (err)
                return msg.react('⚠️');
            return msg.react('✅');
        });
    },
    remove: function remove(msg) {
        var m = msg.content.substring(msg.content.indexOf(' ')).trim();

        if (!cmd.hasOwnProperty(m))
            return `:warning: Command **${m}** doesn't exist.`;
        if (cmd[m].type == 'function')
            return `:warning: Command **${m}** cannot be removed!`;
        delete cmd[m];
        fs.writeFile("commands.json", JSON.stringify(cmd), err => {
            if (err)
                return msg.react('⚠️');
            return msg.react('✅');
        });
    }
}