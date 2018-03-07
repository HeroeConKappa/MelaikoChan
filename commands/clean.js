const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Borrame Esta!")
    if(!args[0]) return message.channel.send("especifica un numero");
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`${args[0]} mensajes volaron magicamente`).then(msg => msg.delete(5000));
    });
}

module.exports.help = {
    name: "clean"
}