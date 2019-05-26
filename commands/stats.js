const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
    name: 'stats',
    description: 'Shows up the status of the bot.',
    aliases: ['status'],
    cooldown: 5,
    async execute(bot, message, args) {
    	 const msg = await message.channel.send(`Gathering stats...`); 

    	 const totalSeconds = process.uptime();
    	 const realTotalSecs = Math.floor(totalSeconds % 60); 
    	 const days = Math.floor((totalSeconds % 31536000) / 86400); 
    	 const hours = Math.floor((totalSeconds / 3600) % 24); 
    	 const mins = Math.floor((totalSeconds / 60) % 60); 
    	 
    	 const embed = new Discord.RichEmbed() 
     	 .setAuthor(bot.user.username, bot.user.avatarURL) 
     	 .setColor(color.blue) 
      	 .setThumbnail(bot.user.avatarURL) 
     	 .addField("Born On", bot.user.createdAt) 
     	 .addField("Current Version", config.version, true) 
     	 .addField("Servers", `${bot.guilds.size} servers`, true) 
     	 .addField("Users", `${bot.users.size.toLocaleString()} users`, true) 
     	 .addField("Ping", `Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\` | API Latency \`${Math.round(bot.ping)}ms\``) 
     	 .addField("Uptime", `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`) 
     	 .setFooter("Created by: Sax#6211") 
    	 .setTimestamp(); 
    	 await msg.edit(embed);
    }
};