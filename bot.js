const botconfig = require("./botconfig.json")
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const bot = new Discord.Client({disableEveryone: true})
const fs = require("fs");

const youtube = new YouTube('AIzaSyCkREN3Dj3zQbfNfYViX0BdrwTwV0laI_s');

bot.commands = new Discord.Collection();

bot.on("ready", async () => {
    console.log(`Lista!`);
    bot.user.setActivity("usar el banhammer")
});

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("No hay comandos para cargar");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} cargado`)
        bot.commands.set(props.help.name, props);
    });
});  

bot.on('guildMemberRemove', member => {
    let leaveEmbed = new Discord.RichEmbed()
    .setTitle("Hoja del Desaparecido")
    .setColor("#0008ff")
    .addField("Lo que paso", "Musulban confirmed")
    .setImage("https://media.giphy.com/media/12KiGLydHEdak8/giphy.gif");

    let leaveChannel = member.guild.channels.find(`name`, 'reportes');

    leaveChannel.send(leaveEmbed);

    return;


});

var servers = {};

bot.on("message", async message =>  {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    var args = message.content.substring(botconfig.prefix.length).split(" ");

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
    
    if(cmd === `${prefix}musulban`){
        let mUser = message.guild.member(message.author|| message.guild.members.get(args[0]));

        let musulbanEmbed = new Discord.RichEmbed()
        .setTitle("Musulban")
        .setDescription("El buen musulban joder :v")
        .setColor("#FB0D01")
        .setImage("https://cdn.discordapp.com/attachments/421053765613780992/421053804440584212/Meme_1.png")
        .addField("Usuario Musulbaneado", `${message.author.username}`)
        .addField("Musulbaneado por", 'el mismo')
        .addField("MusulBaneado en", message.channel)

        let musulbanChannel = message.guild.channels.find(`name`, "reportes");
        if(!musulbanChannel) return message.channel.send("No encontre el canal de reportes :c");
        message.author.createDM('https://discord.gg/uDnBx3x')

        message.guild.member(mUser).kick();
        musulbanChannel.send(musulbanEmbed);
        message.delete().catch(O_o=>{});

        return;

    }

    if(cmd === `${prefix}help`){

        let helpembed = new Discord.RichEmbed()
        .setTitle("Una pequeña ayudita ^^")
        .setColor("#02f2ea")
        .addField("Todo el mundo", "<report <botinfo")
        .addField("Moderadores", "<kick <ban")
        .addField("MelaikoChan-subs", "<play")

        return message.channel.send(helpembed);

        return;
    }
    
    if(cmd === `${prefix}ban`){
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) message.channel.send("No encontre al usuario :c");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Que intentas?");
        if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("No puedo echar a alguien que es poderoso :s");


        let banEmbed = new Discord.RichEmbed()
        .setTitle("Baneado")
        .setDescription("Hoja del Baneado")
        .setColor("#FB0D01")
        .setImage("https://i.imgur.com/6zY5PZ5.gif")
        .addField("Usuario Baneado", `${bUser} con la ID ${bUser.id}`)
        .addField("Expulsado por", `<@${message.author.id}> con la ID ${message.author.id}`)
        .addField("Baneado en", message.channel)
        .addField("Razón", bReason)

        let banChannel = message.guild.channels.find(`name`, "reportes");
        if(!banChannel) return message.channel.send("No encontre el canal de reportes :c");

        message.guild.member(bUser).ban(bReason);
        banChannel.send(banEmbed);
        message.delete().catch(O_o=>{});

        return;

    }

    if(cmd === `${prefix}help`){

        let helpembed = new Discord.RichEmbed()
        .setTitle("Una pequeña ayudita ^^")
        .setColor("#02f2ea")
        .addField("Todo el mundo", "<report <botinfo")
        .addField("Moderadores", "<kick <ban")
        .addField("MelaikoChan-subs", "<play")

        return message.channel.send(helpembed);

        return;
    }
    
    if(cmd === `${prefix}kick`){

        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) message.channel.send("No encontre al usuario :c");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Que intentas?");
        if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("No puedo echar a alguien que es poderoso :s");


        let kickEmbed = new Discord.RichEmbed()
        .setDescription("Expulsion")
        .setColor("#F9E402")
        .setImage("https://cdn.discordapp.com/attachments/419554521774293002/419635976881700876/videotogif_2018.01.21_03.25.41.gif")
        .addField("Usuario Expulsado", `${kUser} con la ID ${kUser.id}`)
        .addField("Expulsado por", `<@${message.author.id}> con la ID ${message.author.id}`)
        .addField("Kickeado en", message.channel)
        .addField("Razón", kReason)

        let kickChannel = message.guild.channels.find(`name`, "reportes");
        if(!kickChannel) return message.channel.send("No encontre el canal de reportes :c");


        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);
        message.delete().catch(O_o=>{});


        return;
    }

    if(cmd === `${prefix}report`){

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("No encontre al usuario :c");
        let reason = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
        .setTitle("Hoja del Reporte")
        .setDescription("Tu reporte")
        .setColor("#FC8403")
        .addField("Usuario Reportado", `${rUser} con la ID ${rUser.id}`)
        .addField("Reportado por", `${message.author} con la ID ${message.author.id}`)
        .addField("Canal", message.channel)
        .addField("Razón", reason);
        

        let reportschannel = message.guild.channels.find(`name`, "reportes");
        if(!reportschannel) return message.channel.send("No hay ningun canal llamado reportes :c");

        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);

        return;
    }

    if(cmd === `${prefix}botinfo`){

        let bicon = bot.user.displayAvatarURL
        let botembed = new Discord.RichEmbed()
        .setDescription("Informacion del MelaikoChan")
        .setColor("#01F95C")
        .setThumbnail(bicon)
        .addField("Nombre del Bot", bot.user.username)
        .addField("Creador del Bot", "HeroeConKappa#8296")
        .addField("Agradecimientos a", "Hydra, Nero y Darmelow :grimacing: ")
        .addField("Creadora de la Imagen", "JeiZet :heart: ")

        return message.channel.send(botembed);

    }

});


bot.login(botconfig.token);